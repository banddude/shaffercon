#!/usr/bin/env python3
"""Regenerate weak hero_intro fields (under 300 chars) on service pages.

Heroes are the OPENING text — first thing visitors see, sets the tone,
mirrors the H1, hooks the reader. Different prompt from closing_content.
"""
import argparse
import os
import sqlite3
import subprocess
import sys
import time

DB = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"

# Reuse the same hint sets as gen_closing.py
sys.path.insert(0, '/Users/mikeshaffer/AIVA/shaffercon/scripts')
from gen_closing import CITY_HINTS, SERVICE_CONTEXT  # noqa: E402


def get_weak_pages(conn, limit=None):
    rows = conn.execute("""
        SELECT id, location, service_type, service_name, hero_intro, closing_content
        FROM service_pages
        WHERE length(hero_intro) < 300
        ORDER BY length(hero_intro), location, service_name
    """).fetchall()
    return rows[:limit] if limit else rows


def build_prompt(row):
    page_id, location, service_type, service_name, current_hero, closing = row
    service_display = service_name.replace('-', ' ').title()
    location_display = location.title()
    landmarks = CITY_HINTS.get(location, "")
    service_ctx = SERVICE_CONTEXT.get(service_name, "")

    return f"""You are writing the HERO INTRODUCTION paragraph for a service page on shaffercon.com (LA licensed electrical & general contractor, CSLB #994593, 25+ years).

This is the FIRST paragraph the visitor reads. It appears right after the H1 "{service_type.title()} {service_display} in {location_display}". It should hook the reader with a specific, locally-grounded scenario, then transition to why this service matters.

CONTEXT
- Location: {location_display}
- Service: {service_type.title()} {service_display}
- {location_display} landmarks/areas to optionally reference: {landmarks}
- Service-specific concerns: {service_ctx}

CURRENT TOO-SHORT/WRONG HERO (will be replaced):
{current_hero}

TASK
Write ONE substantial paragraph (450-650 chars) that:
1. Opens with a specific, vivid {location_display} scenario or observation related to this service. Use a real landmark/business type from the hints above.
2. Pivots to what's at stake for the {service_type} property owner — be concrete (cost, safety, compliance, timeline, comfort).
3. Implies (don't oversell) why a licensed local contractor matters here.

If the location is Altadena, Pasadena, or Pacific Palisades and the service is at all relevant, weave in fire-rebuild context. Eaton Fire (Altadena/Pasadena) and Palisades Fire (Pacific Palisades) — both 2025 events — created huge demand for licensed electrical and structural rebuild work.

HARD RULES
- DO NOT use cliches: "in today's world", "rest assured", "look no further", "world-class", "second to none", "cutting-edge", "state-of-the-art".
- DO NOT use generic openings: "When it comes to...", "At Shaffer Construction...", "Are you looking for...", "Welcome to...".
- DO NOT claim Mike Shaffer personally walks every project or does every job — false. Crews do the work.
- DO NOT use the phone number, email, or "Free quote" CTAs in this hero — those go in the closing section.
- DO use em-dashes for emphasis. Contractions are fine.
- 450-650 chars total — no more.
- Output ONLY the paragraph. No headers/markdown/quotes/labels."""


def gen_one(prompt, retries=4):
    last = None
    for attempt in range(retries):
        try:
            env = os.environ.copy()
            env["ANTHROPIC_MODEL"] = "GLM-5.1"
            env["ANTHROPIC_BASE_URL"] = "https://api.z.ai/api/anthropic"
            env["ANTHROPIC_AUTH_TOKEN"] = "24b70302723d4fc981c4eedb182dd16b.jgi2CvMtPzHHZ0II"
            r = subprocess.run(
                ["claude", "--dangerously-skip-permissions", "-p"],
                input=prompt, capture_output=True, text=True, timeout=180,
                env=env
            )
            if r.returncode == 0 and r.stdout.strip():
                return r.stdout.strip()
            last = f"exit={r.returncode} stderr={r.stderr[:80]!r}"
        except Exception as e:
            last = str(e)
        wait = 30 * (2 ** attempt)
        print(f"  retry in {wait}s ({last})", file=sys.stderr, flush=True)
        time.sleep(wait)
    raise RuntimeError(f"failed: {last}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    conn = sqlite3.connect(DB)
    rows = get_weak_pages(conn, limit=args.limit)
    print(f"Weak hero_intros to fix: {len(rows)}", file=sys.stderr, flush=True)

    for i, row in enumerate(rows, 1):
        page_id, location, service_type, service_name = row[0], row[1], row[2], row[3]
        old_len = len(row[4]) if row[4] else 0
        label = f"[{i}/{len(rows)}] {location} / {service_type}-{service_name}"
        print(f"\n{label}  (was {old_len} chars)", file=sys.stderr, flush=True)

        prompt = build_prompt(row)
        if args.dry_run:
            print(prompt[:400] + "...", file=sys.stderr)
            continue

        try:
            t0 = time.time()
            text = gen_one(prompt)
            elapsed = time.time() - t0
            # Trim if Haiku ignored 650 limit
            if len(text) > 750:
                text = text[:747].rsplit(' ', 1)[0] + '...'
            conn.execute(
                "UPDATE service_pages SET hero_intro = ? WHERE id = ?",
                (text, page_id)
            )
            conn.commit()
            print(f"  ✓ ({elapsed:.0f}s, {len(text)} chars)", file=sys.stderr, flush=True)
        except Exception as e:
            print(f"  ✗ Error: {e}", file=sys.stderr, flush=True)
        time.sleep(3)

    print("DONE", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
