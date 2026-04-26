#!/usr/bin/env python3
"""
After the em-dash sweep, find sentences that have awkward punctuation patterns
left behind (3+ consecutive commas, comma+conjunction immediately followed by
comma, awkward list intros) and use Gemma 4 (local) to suggest cleanups.

Outputs proposed rewrites to /tmp/gemma-rewrites.json for review before applying.
"""
import json
import re
import sqlite3
import sys
import time
from pathlib import Path

import urllib.request

DB = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"
REPO = Path("/Users/mikeshaffer/AIVA/shaffercon")

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma4"


def call_gemma(prompt: str, timeout: int = 60) -> str:
    """Call ollama gemma4 via HTTP, return the response text."""
    body = json.dumps({"model": MODEL, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(
        OLLAMA_URL, data=body, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)["response"]


# Patterns that indicate the sweep left behind awkward text
AWKWARD_PATTERNS = [
    # 3+ consecutive comma phrases that read like a list trapped between
    # what should have been a colon and a continuation
    (re.compile(r"\b(\w+\s+)?\w+,\s*\w[^,]*,\s*[^,]*,\s*and\s+[^,]*,\s+\w"), "post-list comma"),
    # Three commas in a row separating short fragments (typical of double-paren collapse)
    (re.compile(r",\s*[A-Z][^,]{1,30},\s*[^,]{1,30},"), "stacked-paren"),
    # Comma followed immediately by another comma (rare but possible from sweep edge cases)
    (re.compile(r",\s*,"), "double-comma"),
    # Period followed immediately by lowercase (shouldn't happen but check)
    (re.compile(r"[.!?]\s+[a-z]"), "lowercase-after-period"),
]


def score_awkwardness(text: str) -> tuple[int, list[str]]:
    """Return (count of awkward patterns matched, list of pattern names)."""
    hits = []
    for pat, name in AWKWARD_PATTERNS:
        n = len(pat.findall(text))
        for _ in range(n):
            hits.append(name)
    return len(hits), hits


def build_prompt(sentence: str) -> str:
    return f"""Rewrite this sentence to read naturally. Fix any awkward punctuation, but DO NOT change the meaning, the technical content, or the company-specific facts (license types, phone numbers, locations, years, etc.).

DO NOT use em-dashes (—). Use commas, colons, periods, or parentheses instead.

ORIGINAL:
{sentence}

Output ONLY the rewritten sentence, nothing else."""


def find_awkward_sentences():
    """Scan DB + blog JSON for sentences with awkward post-sweep patterns."""
    findings = []

    # DB
    conn = sqlite3.connect(DB)
    targets = [
        ("service_pages", "id", "closing_content"),
        ("service_pages", "id", "hero_intro"),
        ("service_benefits", "id", "content"),
        ("service_faqs", "id", "answer"),
        ("pages_all", "id", "meta_description"),
    ]
    for table, idcol, textcol in targets:
        try:
            rows = conn.execute(f"SELECT {idcol}, {textcol} FROM {table}").fetchall()
        except sqlite3.Error:
            continue
        for rid, txt in rows:
            if not txt:
                continue
            # Split into sentences and score each
            sentences = re.split(r"(?<=[.!?])\s+", txt)
            for sent in sentences:
                if len(sent) < 30 or len(sent) > 600:
                    continue
                score, hits = score_awkwardness(sent)
                if score >= 1:
                    findings.append({
                        "source": f"db:{table}.{textcol}",
                        "id": rid,
                        "table": table,
                        "column": textcol,
                        "sentence": sent,
                        "score": score,
                        "patterns": hits,
                    })
    conn.close()

    # Blog JSONs
    for f in sorted((REPO / "content/industry-insights").glob("*.json")):
        try:
            d = json.loads(f.read_text())
        except Exception:
            continue
        for k, v in d.items():
            if not isinstance(v, str):
                continue
            text = re.sub(r"<[^>]+>", " ", v) if "content" in k else v
            text = re.sub(r"\s+", " ", text).strip()
            sentences = re.split(r"(?<=[.!?])\s+", text)
            for sent in sentences:
                if len(sent) < 30 or len(sent) > 600:
                    continue
                score, hits = score_awkwardness(sent)
                if score >= 1:
                    findings.append({
                        "source": f"json:{f.name}#{k}",
                        "file": str(f),
                        "field": k,
                        "sentence": sent,
                        "score": score,
                        "patterns": hits,
                    })
    return findings


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, help="Max sentences to process via Gemma")
    p.add_argument("--no-rewrite", action="store_true", help="Just list awkward sentences, don't call Gemma")
    args = p.parse_args()

    print("Scanning for awkward sentences...", file=sys.stderr)
    findings = find_awkward_sentences()
    print(f"  found {len(findings)} awkward sentences", file=sys.stderr)

    # Score breakdown
    from collections import Counter
    pat_counts = Counter(p for f in findings for p in f["patterns"])
    print("Pattern breakdown:", file=sys.stderr)
    for pat, n in pat_counts.most_common():
        print(f"  {n:5}  {pat}", file=sys.stderr)

    if args.no_rewrite:
        with open("/tmp/awkward-sentences.json", "w") as f:
            json.dump(findings, f, indent=2, default=str)
        print(f"\nSaved: /tmp/awkward-sentences.json", file=sys.stderr)
        return

    # Sort by score (worst first)
    findings.sort(key=lambda f: -f["score"])
    if args.limit:
        findings = findings[: args.limit]

    print(f"\nCalling Gemma on {len(findings)} sentences...", file=sys.stderr)
    rewrites = []
    for i, f in enumerate(findings, 1):
        sent = f["sentence"]
        prompt = build_prompt(sent)
        try:
            t0 = time.time()
            new = call_gemma(prompt).strip().strip('"').strip("'")
            elapsed = time.time() - t0
            f["rewritten"] = new
            f["elapsed"] = elapsed
            rewrites.append(f)
            print(f"[{i}/{len(findings)}] {elapsed:.0f}s", file=sys.stderr)
            print(f"  BEFORE: {sent[:100]}", file=sys.stderr)
            print(f"  AFTER:  {new[:100]}", file=sys.stderr)
        except Exception as e:
            print(f"[{i}/{len(findings)}] ERROR: {e}", file=sys.stderr)

    with open("/tmp/gemma-rewrites.json", "w") as fp:
        json.dump(rewrites, fp, indent=2, default=str)
    print(f"\nSaved: /tmp/gemma-rewrites.json", file=sys.stderr)


if __name__ == "__main__":
    main()
