#!/usr/bin/env python3
"""
Second-pass cleanup: convert "phrase, item, item, and item, continuation"
patterns left behind by the em-dash sweep into "phrase: item, item, and item,
continuation".

These are list-intros where the inner list contained its own commas, which
made the first pass's heuristic miss them.

Strategy: only fire when the intro phrase ends in a HEAD WORD from a
hand-curated allowlist of list-introducing nouns/quantifiers. This catches
the genuine misfires from the em-dash sweep without breaking valid compound
lists like "owners, developers, and businesses".

GUARD: skip any match where the intro head word is preceded by a colon within
80 chars - that means the em-dash sweep already converted the OUTER list
intro to a colon, and what looks like a list-intro pattern is actually the
inner list.
"""
import json
import re
import sqlite3
import sys
from pathlib import Path

DB = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"
REPO = Path("/Users/mikeshaffer/AIVA/shaffercon")

LIST_INTRO_HEADS = {
    # Quantifiers / pronouns
    "everything", "anything", "nothing",
    "all", "both", "many", "several", "few", "most", "some",
    "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    # Container nouns
    "set", "list", "scope", "approach", "process", "range", "suite", "spectrum",
    "menu", "lineup", "roster", "stack", "toolkit",
    # Service/solution nouns
    "feature", "features", "benefit", "benefits",
    "trifecta", "combo", "combination",
    # Credentials
    "license", "licenses", "credential", "credentials", "qualification",
    "qualifications", "certification", "certifications",
    # Aggregates
    "team", "crew", "category", "categories",
    "kit", "loadout",
    # Descriptive nouns
    "climate", "weather", "vibe", "feel", "atmosphere", "character",
    "blend", "palette",
}
# NOTE: deliberately omitted "package", "system", "service", "specs",
# "components", "materials", "equipment", "hardware", "gear", "mix" - these
# are commonly used INSIDE bigger sentences where promoting to colon would
# break flow. Only quantifiers and credential-type nouns where the list IS
# the expansion stay in.

LIST_INTRO_PATTERN = re.compile(
    r"((?:\b\w+\s+){0,5}\b(\w+)),\s*"
    r"((?:[A-Z]?[\w\-/&]+(?:\s+[\w\-/&]+){0,4},\s*){1,5}"
    r"and\s+[A-Z]?[\w\-/&]+(?:\s+[\w\-/&]+){0,4})"
    r"\s*,\s+"
    r"(?=[a-z])"
)


def fix_text(text: str) -> tuple[str, int]:
    """Apply colon promotion. Returns (new_text, count)."""
    if not text or "," not in text:
        return text, 0

    count = 0

    def repl(m):
        nonlocal count
        intro = m.group(1)
        head_word = m.group(2).lower()
        list_part = m.group(3)
        if head_word not in LIST_INTRO_HEADS:
            return m.group(0)
        # GUARD: if a colon appears in the preceding 80 chars (outside
        # this match), skip — the outer list intro already used a colon
        # and we'd create a double-colon.
        match_start = m.start()
        preceding = text[max(0, match_start - 80):match_start]
        if ":" in preceding:
            return m.group(0)
        count += 1
        return f"{intro}: {list_part}, "

    return LIST_INTRO_PATTERN.sub(repl, text), count


def fix_db(dry_run: bool = False) -> int:
    conn = sqlite3.connect(DB)
    targets = [
        ("service_pages", "id", "closing_content"),
        ("service_pages", "id", "hero_intro"),
        ("service_benefits", "id", "content"),
        ("service_faqs", "id", "answer"),
    ]
    total = 0
    for table, idcol, textcol in targets:
        rows = conn.execute(f"SELECT {idcol}, {textcol} FROM {table} WHERE {textcol} LIKE '%, and %'").fetchall()
        rows_changed = replacements = 0
        for rid, txt in rows:
            new_txt, n = fix_text(txt)
            if n > 0:
                rows_changed += 1
                replacements += n
                if not dry_run:
                    conn.execute(f"UPDATE {table} SET {textcol} = ? WHERE {idcol} = ?", (new_txt, rid))
        if rows_changed and not dry_run:
            conn.commit()
        if rows_changed:
            print(f"  {table}.{textcol}: {replacements} fixes / {rows_changed} rows", file=sys.stderr)
        total += replacements
    conn.close()
    return total


def fix_blog_json(dry_run: bool = False) -> int:
    total = files_changed = 0
    for f in sorted((REPO / "content/industry-insights").glob("*.json")):
        try:
            d = json.loads(f.read_text())
        except Exception:
            continue
        any_change = False
        for k, v in list(d.items()):
            if not isinstance(v, str) or "," not in v:
                continue
            new_v, n = fix_text(v)
            if n > 0:
                d[k] = new_v
                total += n
                any_change = True
        if any_change:
            files_changed += 1
            if not dry_run:
                with open(f, "w") as fp:
                    json.dump(d, fp, indent=2, ensure_ascii=False)
    print(f"  blog json: {total} fixes / {files_changed} files", file=sys.stderr)
    return total


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--test", action="store_true")
    args = p.parse_args()

    if args.test:
        samples = [
            # SHOULD fix (head word in allowlist, no preceding colon):
            ("FIX", "We handle everything, load studies, sizing, placement, permitting with LADBS, and final commissioning, so you can focus on your customers."),
            ("FIX", "We carry three, A, B, and C-10, which matters when you're installing infrastructure."),
            ("FIX", "Santa Monica's unique climate, sunny days, ocean breezes, and mild evenings, makes it the perfect spot."),
            ("FIX", "Our service includes the full trifecta, design, install, and commissioning, all in-house."),
            # Should NOT fix (head word not in allowlist):
            ("KEEP", "We help LA property owners, developers, and businesses plan, permit, and install EV charging."),
            ("KEEP", "By integrating clean energy, automated charging, fleet infrastructure, and industry standards, businesses lead."),
            ("KEEP", "From DALI-2 and 0-10V lighting, BACnet/IP for BMS, PoE, and API-driven control, all available."),
            # Should NOT fix (preceding colon means it's the inner list of a real list intro):
            ("KEEP", "You receive a concise design package: scope, materials, one-line diagram, and schedule, tailored to your property's layout and business needs."),
            ("KEEP", "Then we tailor a package: LED specs, control zones, schedules, and sensor placement, optimized for your building."),
            ("KEEP", "Our proposal breaks down service equipment: distribution systems, branch circuits, lighting and controls, emergency systems, and options including EV charging, backup power, and solar/battery integration."),
        ]
        ok = bad = 0
        for expected, s in samples:
            new, n = fix_text(s)
            actual = "FIX" if n > 0 else "KEEP"
            mark = "✓" if actual == expected else "✗"
            if mark == "✓":
                ok += 1
            else:
                bad += 1
            print(f"  {mark} expected={expected} got={actual}")
            print(f"     BEFORE: {s}")
            print(f"     AFTER:  {new}")
            print()
        print(f"PASS {ok}/{ok+bad}")
        return

    print("DB:", file=sys.stderr)
    fix_db(dry_run=args.dry_run)
    print("Blog JSON:", file=sys.stderr)
    fix_blog_json(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
