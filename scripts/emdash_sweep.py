#!/usr/bin/env python3
"""
Surgical em-dash removal sweep.

Applies these rules in order:

1. Numeric/date range: "8am—5pm", "$10—$20", "2020—2024"
   → en-dash "–" (proper typography)

2. Parenthetical pair: "word—aside—word"
   → ", aside, "

3. List intro: "phrase—item, item, and item"
   → "phrase: item, item, and item"

4. Trailing connector: "phrase—and X" / "phrase—but X" / "phrase—because"…
   → ", and X" / ", but X" / ", because"

5. Sentence break candidate: long preceding clause + capitalized leader
   like "—We" / "—Call" / "—No"
   → ". " + capitalize first word

6. Default trailing: → ", "

After the sweep, NO em-dashes should remain. Re-scan to verify.
"""
import json
import re
import sqlite3
import sys
from pathlib import Path

DB = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"
REPO = Path("/Users/mikeshaffer/AIVA/shaffercon")
EMDASH = "—"
ENDASH = "–"

# Numeric/date range pattern (numbers or money or units, em-dash, more of same)
# Numeric range: numbers/money on both sides of the dash. Don't gobble outer whitespace.
NUMERIC_RANGE_RE = re.compile(
    r"(\$?\d[\d,.]*(?:am|pm|AM|PM|hours?|hrs?|days?|years?|months?|minutes?|miles?|ft|kW|amps?|A|V|MW)?)"
    + EMDASH
    + r"(\$?\d[\d,.]*(?:am|pm|AM|PM|hours?|hrs?|days?|years?|months?|minutes?|miles?|ft|kW|amps?|A|V|MW)?)"
)

COMMA_CONNECTORS = {
    "and", "but", "so", "or", "yet", "because", "which", "who",
    "where", "when", "while", "though", "although", "since", "as",
    "from", "with", "without", "until", "before", "after",
}

SENTENCE_BREAKERS = (
    "we ", "you ", "they ", "shaffer ", "your ", "our ", "no ",
    "call ", "ready ", "let ", "every ", "if ", "in fact ",
    "that ", "this ", "those ", "these ",
)


def replace_numeric_ranges(text: str) -> str:
    return NUMERIC_RANGE_RE.sub(lambda m: f"{m.group(1)}{ENDASH}{m.group(2)}", text)


def find_paren_pairs(text: str):
    """Return list of (open_idx, close_idx) for em-dash pairs that look parenthetical."""
    pairs = []
    indices = [m.start() for m in re.finditer(EMDASH, text)]
    used = set()
    for i, oi in enumerate(indices):
        if oi in used:
            continue
        for ci in indices[i + 1:]:
            if ci - oi > 100:
                break
            if ci in used:
                continue
            inner = text[oi + 1 : ci]
            if not inner.strip():
                break
            # Skip if inner contains a sentence boundary (period+space+capital)
            if re.search(r"[.!?]\s+[A-Z]", inner):
                break
            pairs.append((oi, ci))
            used.add(oi)
            used.add(ci)
            break
    return pairs


def replace_parens(text: str) -> str:
    pairs = find_paren_pairs(text)
    if not pairs:
        return text
    chars = list(text)
    # Replace from the end so indices stay valid
    for oi, ci in sorted(pairs, key=lambda p: p[0], reverse=True):
        # Helper: replace dash at idx with ", " - swallowing any pre-space
        # to avoid double-space issues.
        for idx in (ci, oi):
            # Look at the neighbors
            pre = chars[idx - 1] if idx > 0 else ""
            post = chars[idx + 1] if idx + 1 < len(chars) else ""
            if pre == " " and post != " ":
                # " —X" → ", X"
                chars[idx - 1] = ","
                chars[idx] = " "
            elif pre != " " and post == " ":
                # "X— Y" → "X, Y"
                chars[idx] = ","
            elif pre == " " and post == " ":
                # " — " → ", "
                chars[idx - 1] = ","
                chars[idx] = ""
            else:
                # "X—Y" → "X, Y"
                chars[idx] = ", "
    return "".join(chars)


def replace_list_intros(text: str) -> str:
    """Promote em-dash to colon when followed by a list."""
    out = []
    i = 0
    n = len(text)
    while i < n:
        if text[i] == EMDASH:
            # Look at the following 80 chars (or until next em-dash / sentence end)
            window = text[i + 1 : i + 81]
            sent_end = re.search(r"[.!?](\s|$)", window)
            next_dash = window.find(EMDASH)
            stop = len(window)
            if sent_end:
                stop = min(stop, sent_end.start())
            if next_dash != -1:
                stop = min(stop, next_dash)
            chunk = window[:stop]
            commas = chunk.count(",")
            has_and = " and " in chunk
            if commas >= 2 or (commas >= 1 and has_and):
                # Strip trailing space from out, then ': '
                if out and out[-1] == " ":
                    out.pop()
                out.append(": ")
                # Skip a single space after the dash
                if i + 1 < n and text[i + 1] == " ":
                    i += 2
                    continue
                i += 1
                continue
        out.append(text[i])
        i += 1
    return "".join(out)


def replace_trailing(text: str) -> str:
    """Handle every remaining em-dash with comma or sentence break."""
    out = []
    i = 0
    n = len(text)
    while i < n:
        if text[i] != EMDASH:
            out.append(text[i])
            i += 1
            continue

        # Strip trailing space from out
        had_space_before = out and out[-1] == " "
        if had_space_before:
            out.pop()

        # Skip a leading space after the em-dash
        skip = 1
        if i + 1 < n and text[i + 1] == " ":
            skip = 2

        # Find next word
        j = i + skip
        m = re.match(r"^(\w+)", text[j:])
        next_word = m.group(1) if m else ""
        next_word_lc = next_word.lower()

        # Determine replacement
        if next_word_lc in COMMA_CONNECTORS:
            out.append(", ")
        else:
            # Sentence break heuristic: long current sentence + sentence-breaker leader
            preceding = "".join(out)
            last_sent_end = max(
                preceding.rfind(". "),
                preceding.rfind("! "),
                preceding.rfind("? "),
                preceding.rfind(".\n"),
            )
            curr_sent_len = (
                len(preceding) - last_sent_end if last_sent_end != -1 else len(preceding)
            )
            next_chunk_lc = text[j : j + 60].lower()
            is_breaker = any(next_chunk_lc.startswith(b) for b in SENTENCE_BREAKERS)

            # Imperative verbs that signal "start of new directive"
            imperatives = ("call", "let", "ready", "no", "we", "you", "your", "our",
                           "shaffer", "every", "if")
            is_imperative = next_word_lc in imperatives

            if (curr_sent_len >= 50 and is_breaker) or (curr_sent_len >= 30 and is_imperative):
                # Period + capitalize next word
                out.append(". ")
                if m:
                    cap = next_word[0].upper() + next_word[1:]
                    out.append(cap)
                    j += len(next_word)
            else:
                out.append(", ")
        i = j
    return "".join(out)


def sweep(text: str) -> str:
    if not text or EMDASH not in text:
        return text
    text = replace_numeric_ranges(text)
    text = replace_parens(text)
    text = replace_list_intros(text)
    text = replace_trailing(text)
    return text


# ---------- runners ----------

def sweep_db(dry_run: bool = False) -> int:
    conn = sqlite3.connect(DB)
    targets = [
        ("service_pages", "id", "closing_content"),
        ("service_pages", "id", "hero_intro"),
        ("service_benefits", "id", "content"),
        ("service_benefits", "id", "heading"),
        ("service_faqs", "id", "answer"),
        ("service_faqs", "id", "question"),
        ("service_offerings", "id", "offering"),
        ("pages_all", "id", "meta_title"),
        ("pages_all", "id", "meta_description"),
        ("site_config", "id", "description"),
    ]
    total = 0
    for table, idcol, textcol in targets:
        try:
            rows = conn.execute(
                f"SELECT {idcol}, {textcol} FROM {table} WHERE {textcol} LIKE '%{EMDASH}%'"
            ).fetchall()
        except sqlite3.Error as e:
            print(f"  ! {table}.{textcol}: {e}", file=sys.stderr)
            continue
        updated = 0
        for rid, txt in rows:
            new_txt = sweep(txt)
            if new_txt != txt:
                if not dry_run:
                    conn.execute(
                        f"UPDATE {table} SET {textcol} = ? WHERE {idcol} = ?",
                        (new_txt, rid),
                    )
                updated += 1
        if updated and not dry_run:
            conn.commit()
        if rows:
            print(f"  {table}.{textcol}: {updated}/{len(rows)}", file=sys.stderr)
        total += updated
    conn.close()
    return total


def sweep_blog_json(dry_run: bool = False) -> int:
    updated = 0
    for f in sorted((REPO / "content/industry-insights").glob("*.json")):
        try:
            d = json.loads(f.read_text())
        except Exception:
            continue
        changed = False
        for k, v in list(d.items()):
            if isinstance(v, str) and EMDASH in v:
                new_v = sweep(v)
                if new_v != v:
                    d[k] = new_v
                    changed = True
        if changed:
            updated += 1
            if not dry_run:
                with open(f, "w") as fp:
                    json.dump(d, fp, indent=2, ensure_ascii=False)
    print(f"  blog json: {updated} files", file=sys.stderr)
    return updated


def sweep_static(dry_run: bool = False) -> int:
    updated = 0
    for path in [REPO / "site/public/llms.txt"]:
        if not path.exists():
            continue
        text = path.read_text()
        if EMDASH not in text:
            continue
        new_text = sweep(text)
        if new_text != text:
            if not dry_run:
                path.write_text(new_text)
            updated += 1
            print(f"  static: {path.name}", file=sys.stderr)
    return updated


def sweep_code(dry_run: bool = False) -> int:
    updated = 0
    for f in (REPO / "site").rglob("*.tsx"):
        if "node_modules" in str(f) or ".next" in str(f):
            continue
        try:
            text = f.read_text()
        except Exception:
            continue
        if EMDASH not in text:
            continue
        new_text = sweep(text)
        if new_text != text:
            if not dry_run:
                f.write_text(new_text)
            updated += 1
            print(f"  code: {f.relative_to(REPO)}", file=sys.stderr)
    return updated


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--what", choices=["db", "json", "code", "static", "all"], default="all")
    p.add_argument("--test", action="store_true", help="Run unit-test samples")
    args = p.parse_args()

    if args.test:
        samples = [
            "We handle the full process—load calculations, permits, panel upgrades, and inspections.",
            "Our hours are 8am—5pm Monday through Friday.",
            "From 2020—2024 the demand grew rapidly.",
            "We offer the triple license—A, B, and C-10—to handle every job.",
            "Call us at (323) 642-8509—we'll get you a free quote.",
            "Shaffer Construction—a licensed LA contractor—handles every step.",
            "It's not just about plugging in a unit—it's about peace of mind.",
            "Don't wait to start saving—call us today.",
            "We take pride in our work—every job, every customer.",
            "From the panel to the wall—every wire, every connection—is done right.",
        ]
        for s in samples:
            print(f"BEFORE: {s}")
            print(f"AFTER:  {sweep(s)}")
            print()
        return

    if args.what in ("db", "all"):
        print("DB:", file=sys.stderr)
        sweep_db(dry_run=args.dry_run)
    if args.what in ("json", "all"):
        print("Blog JSON:", file=sys.stderr)
        sweep_blog_json(dry_run=args.dry_run)
    if args.what in ("code", "all"):
        print("Code:", file=sys.stderr)
        sweep_code(dry_run=args.dry_run)
    if args.what in ("static", "all"):
        print("Static:", file=sys.stderr)
        sweep_static(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
