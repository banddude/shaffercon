#!/usr/bin/env python3
"""
Build a complete inventory of every em-dash on the site, with classification
of each occurrence by surrounding context.

Output:
  /tmp/emdash-inventory.json — structured data for the surgical sweep
  /tmp/emdash-inventory.md   — human-readable list (per source/table)

Classification (helps the surgical sweep decide what to do):

  list_intro        " word—item, item, item"   → ": " or ", including "
  parenthetical     " word—aside—word"        → ", aside, " or " (aside) "
  trailing_clause   " word—follow on"         → ". " or ", " or ": "
  range_numeric     " 8am—5pm" or "$3—$5"     → en-dash "–" or " to "
  range_year        " 2020—2024"              → en-dash "–"
  inline_compound   "code-compliant"          → unaffected (these are hyphens)
  unknown           anything else             → flag for LLM review
"""
import json
import re
import sqlite3
import sys
from pathlib import Path
from collections import defaultdict

DB = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"
REPO = Path("/Users/mikeshaffer/AIVA/shaffercon")
EMDASH = "—"


def classify(text: str, idx: int):
    """Return (category, before_chunk, after_chunk) for an em-dash at position idx in text."""
    # Get ~60 chars before/after
    before = text[max(0, idx - 60):idx]
    after = text[idx + 1:idx + 61]

    # Immediate neighbors (single chars)
    left = text[idx - 1] if idx > 0 else ""
    right = text[idx + 1] if idx + 1 < len(text) else ""

    # Numeric range: 8am—5pm, $3—$5, 2020—2024, 100—200
    left_word = re.search(r"(\$?\d[\d,.]*\w*)\s*$", before)
    right_word = re.match(r"^\s*(\$?\d[\d,.]*\w*)", after)
    if left_word and right_word:
        # Year range vs other numeric
        if re.match(r"^(19|20)\d{2}$", left_word.group(1)) and re.match(r"^(19|20)\d{2}$", right_word.group(1)):
            return "range_year", before, after
        return "range_numeric", before, after

    # Look for matching second em-dash within next 80 chars → parenthetical
    next_dash = text.find(EMDASH, idx + 1, idx + 1 + 120)
    if next_dash != -1:
        # If there's a comma between them, less likely parenthetical
        between = text[idx + 1:next_dash]
        if len(between) <= 80 and between.strip() and not between.startswith(' '):
            # likely parenthetical
            return "parenthetical_open", before, after
        if len(between) <= 80 and between.strip():
            return "parenthetical_open", before, after

    # Check if previous em-dash within 120 chars (closing paren)
    prev_dash = text.rfind(EMDASH, max(0, idx - 120), idx)
    if prev_dash != -1:
        between = text[prev_dash + 1:idx]
        if len(between) <= 80 and between.strip():
            return "parenthetical_close", before, after

    # List intro: "word—item, item, item" or "word—item and item"
    # i.e., what follows contains a comma within 80 chars
    if "," in after[:80] or " and " in after[:60]:
        # But not if followed by a single short clause
        # Heuristic: at least 2 commas OR comma + and
        if after.count(",") >= 2 or (after.count(",") >= 1 and " and " in after[:80]):
            return "list_intro", before, after

    # Trailing clause: word—word word word (sentence continues, no second dash)
    return "trailing_clause", before, after


def find_emdashes(text: str):
    """Return list of (idx, category, before, after) for every em-dash in text."""
    results = []
    if not text:
        return results
    for m in re.finditer(EMDASH, text):
        idx = m.start()
        cat, before, after = classify(text, idx)
        results.append({
            "idx": idx,
            "category": cat,
            "before": before,
            "after": after,
            "context": (before[-30:] + EMDASH + after[:30]).replace("\n", "\\n"),
        })
    return results


def scan_db():
    """Scan all DB text columns for em-dashes."""
    conn = sqlite3.connect(DB)
    findings = []

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
    for table, idcol, textcol in targets:
        try:
            rows = conn.execute(f"SELECT {idcol}, {textcol} FROM {table} WHERE {textcol} LIKE '%—%'").fetchall()
            for rid, txt in rows:
                if not txt:
                    continue
                for occ in find_emdashes(txt):
                    findings.append({
                        "source": f"db:{table}.{textcol}",
                        "id": rid,
                        "table": table,
                        "column": textcol,
                        **occ,
                        "full_text_len": len(txt),
                    })
        except sqlite3.Error as e:
            print(f"  ! {table}.{textcol}: {e}", file=sys.stderr)
    return findings


def scan_blog_json():
    """Scan blog post JSON files."""
    findings = []
    for f in sorted((REPO / "content/industry-insights").glob("*.json")):
        try:
            d = json.loads(f.read_text())
        except Exception:
            continue
        for k, v in d.items():
            if isinstance(v, str) and EMDASH in v:
                for occ in find_emdashes(v):
                    findings.append({
                        "source": f"json:{f.name}#{k}",
                        "file": str(f),
                        "field": k,
                        "slug": d.get("slug", ""),
                        **occ,
                        "full_text_len": len(v),
                    })
    return findings


def scan_code():
    """Scan TSX/code files for em-dashes."""
    findings = []
    for f in (REPO / "site").rglob("*.tsx"):
        if "node_modules" in str(f) or ".next" in str(f):
            continue
        try:
            text = f.read_text()
        except Exception:
            continue
        if EMDASH not in text:
            continue
        for occ in find_emdashes(text):
            # Get line number
            line_num = text[:occ["idx"]].count("\n") + 1
            findings.append({
                "source": f"code:{f.relative_to(REPO)}",
                "file": str(f),
                "line": line_num,
                **occ,
                "full_text_len": len(text),
            })
    return findings


def scan_static():
    """Scan llms.txt and any other static text files."""
    findings = []
    for path in [REPO / "site/public/llms.txt"]:
        if not path.exists():
            continue
        text = path.read_text()
        if EMDASH not in text:
            continue
        for occ in find_emdashes(text):
            line_num = text[:occ["idx"]].count("\n") + 1
            findings.append({
                "source": f"static:{path.name}",
                "file": str(path),
                "line": line_num,
                **occ,
                "full_text_len": len(text),
            })
    return findings


def main():
    print("Scanning DB...", file=sys.stderr)
    db = scan_db()
    print(f"  {len(db)} occurrences", file=sys.stderr)

    print("Scanning blog JSON...", file=sys.stderr)
    blog = scan_blog_json()
    print(f"  {len(blog)} occurrences", file=sys.stderr)

    print("Scanning code...", file=sys.stderr)
    code = scan_code()
    print(f"  {len(code)} occurrences", file=sys.stderr)

    print("Scanning static files...", file=sys.stderr)
    static = scan_static()
    print(f"  {len(static)} occurrences", file=sys.stderr)

    all_findings = db + blog + code + static
    print(f"\nTOTAL: {len(all_findings)} em-dash occurrences", file=sys.stderr)

    # Categorize
    by_cat = defaultdict(int)
    by_source_root = defaultdict(int)
    for f in all_findings:
        by_cat[f["category"]] += 1
        root = f["source"].split(":")[0] + ":" + f["source"].split(":")[1].split(".")[0].split("/")[0].split("#")[0]
        by_source_root[root] += 1

    print(f"\nBy category:", file=sys.stderr)
    for c, n in sorted(by_cat.items(), key=lambda x: -x[1]):
        print(f"  {n:6}  {c}", file=sys.stderr)

    # Save JSON
    with open("/tmp/emdash-inventory.json", "w") as f:
        json.dump({
            "total": len(all_findings),
            "by_category": dict(by_cat),
            "findings": all_findings,
        }, f, indent=2, default=str)
    print(f"\nFull data: /tmp/emdash-inventory.json", file=sys.stderr)

    # Markdown report
    lines = ["# Em-Dash Inventory\n"]
    lines.append(f"Total occurrences: **{len(all_findings)}**\n")
    lines.append("## By category\n")
    for c, n in sorted(by_cat.items(), key=lambda x: -x[1]):
        lines.append(f"- **{c}**: {n}")
    lines.append("\n## Sample by category\n")
    by_cat_sample = defaultdict(list)
    for f in all_findings:
        by_cat_sample[f["category"]].append(f)
    for cat, items in by_cat_sample.items():
        lines.append(f"\n### {cat} ({len(items)})\n")
        for it in items[:5]:
            lines.append(f"- `{it['source']}` … `{it['context']}`")

    with open("/tmp/emdash-inventory.md", "w") as f:
        f.write("\n".join(lines))
    print(f"Report:    /tmp/emdash-inventory.md", file=sys.stderr)


if __name__ == "__main__":
    main()
