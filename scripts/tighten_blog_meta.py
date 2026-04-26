#!/usr/bin/env python3
"""
Tighten long blog post titles (>60 chars effective) and long meta descriptions
(>160 chars). Uses GLM-5.1 (Z.AI) via Anthropic-compatible API.

Reads blog post JSON files, rewrites overlong title/metaDescription fields
with a tight, click-worthy version, writes back. Skips files that are
already within limits.

Title budget: 38 chars in JSON → Total 60 chars after layout.tsx appends
" | Shaffer Construction" (22 chars). Aim for ~50 chars in JSON max.

Description budget: 160 chars hard limit, target 140-155.
"""
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

CONTENT_DIR = Path('/Users/mikeshaffer/AIVA/shaffercon/content/industry-insights')

# Target lengths
TITLE_MAX_JSON = 60  # Google truncates around 60 mobile, 70 desktop. Aim for ≤60 raw.
DESC_MAX = 155

def call_haiku(prompt, retries=4):
    """Call claude -p haiku with retries."""
    last_err = None
    for attempt in range(retries):
        try:
            t0 = time.time()
            env = os.environ.copy()
            env["ANTHROPIC_MODEL"] = "GLM-5.1"
            env["ANTHROPIC_BASE_URL"] = "https://api.z.ai/api/anthropic"
            env["ANTHROPIC_AUTH_TOKEN"] = "24b70302723d4fc981c4eedb182dd16b.jgi2CvMtPzHHZ0II"
            result = subprocess.run(
                ["claude", "--dangerously-skip-permissions", "-p"],
                input=prompt, capture_output=True, text=True, timeout=180,
                env=env
            )
            elapsed = time.time() - t0
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip(), elapsed
            last_err = f"exit={result.returncode} stderr={result.stderr[:80]!r}"
        except Exception as e:
            last_err = str(e)
        wait = 30 * (2 ** attempt)
        print(f"      retry in {wait}s ({last_err})", file=sys.stderr, flush=True)
        time.sleep(wait)
    raise RuntimeError(f"failed after {retries}: {last_err}")


def tighten_title(current_title, content_excerpt):
    """Generate a tight rewrite of an overlong blog title."""
    prompt = f"""Rewrite this blog post title. Current title is too long for SEO.

CURRENT TITLE: {current_title}

CONTEXT (post body excerpt):
{content_excerpt[:600]}

REQUIREMENTS:
- Maximum 50 characters
- Specific, click-worthy, includes the strongest keyword/topic
- No clickbait. No 'breakthrough', 'revolution', 'transformation' hype words.
- Title-Case
- DO NOT add 'Shaffer Construction' or '|' separator (template appends those)
- DO NOT use em-dashes (—) anywhere. Use commas, colons, periods, or parentheses instead.

Output ONLY the new title, no quotes/explanation/preamble"""
    out, _ = call_haiku(prompt)
    title = out.strip().strip('"').strip("'").strip()
    # Strip if Haiku ignored instruction and added " | Shaffer..."
    if ' | ' in title:
        title = title.split(' | ')[0]
    return title


def tighten_description(current_desc, title, content_excerpt):
    """Generate a tight rewrite of an overlong description."""
    prompt = f"""Rewrite this blog post meta description. Current is over 160 chars.

CURRENT DESCRIPTION ({len(current_desc) if current_desc else 0} chars):
{current_desc or '(empty)'}

POST TITLE: {title}

POST CONTENT (excerpt):
{content_excerpt[:600]}

REQUIREMENTS:
- 130-{DESC_MAX} chars (HARD MAX {DESC_MAX+5})
- Hook + key fact + implicit CTA
- Mention LA/Los Angeles if relevant to topic
- No 'Read more', 'Learn more', or other generic phrases
- DO NOT use em-dashes (—) anywhere. Use commas, colons, or periods instead.
- Output ONLY the new description, no quotes/explanation/preamble"""
    out, _ = call_haiku(prompt)
    desc = out.strip().strip('"').strip("'").strip()
    if len(desc) > 160:
        desc = desc[:157].rsplit(' ', 1)[0] + '...'
    return desc


def main():
    files = sorted(CONTENT_DIR.glob('*.json'))
    title_to_fix = []
    desc_to_fix = []
    for f in files:
        try:
            d = json.loads(f.read_text())
        except: continue
        # Title check (limit in JSON)
        if len(d.get('title', '')) > TITLE_MAX_JSON:
            title_to_fix.append(f)
        # Description check
        if len(d.get('metaDescription', '')) > DESC_MAX + 5:
            desc_to_fix.append(f)

    print(f"Long titles to fix:       {len(title_to_fix)}", flush=True)
    print(f"Long descriptions to fix: {len(desc_to_fix)}", flush=True)
    print()

    # Fix titles first (these are higher impact)
    for i, f in enumerate(title_to_fix, 1):
        try:
            d = json.loads(f.read_text())
            old = d['title']
            text = re.sub(r'<[^>]+>', ' ', d.get('content', ''))
            text = re.sub(r'\s+', ' ', text).strip()

            new = tighten_title(old, text)
            if len(new) > 70:
                # Hard truncate
                new = new[:67].rsplit(' ', 1)[0] + '...'
            d['title'] = new
            with open(f, 'w') as fp:
                json.dump(d, fp, indent=2, ensure_ascii=False)
            print(f"[T {i:>3}/{len(title_to_fix)}] ({len(old)}->{len(new)}) {new}", flush=True)
        except Exception as e:
            print(f"[T {i:>3}/{len(title_to_fix)}] ERROR: {e}", flush=True)
        time.sleep(2)

    # Then descriptions
    print(flush=True)
    for i, f in enumerate(desc_to_fix, 1):
        try:
            d = json.loads(f.read_text())
            old = d.get('metaDescription', '')
            if len(old) <= DESC_MAX + 5:
                continue  # already fixed by title pass? unlikely but safe
            text = re.sub(r'<[^>]+>', ' ', d.get('content', ''))
            text = re.sub(r'\s+', ' ', text).strip()

            new = tighten_description(old, d.get('title', ''), text)
            d['metaDescription'] = new
            with open(f, 'w') as fp:
                json.dump(d, fp, indent=2, ensure_ascii=False)
            print(f"[D {i:>3}/{len(desc_to_fix)}] ({len(old)}->{len(new)}) {new[:80]}", flush=True)
        except Exception as e:
            print(f"[D {i:>3}/{len(desc_to_fix)}] ERROR: {e}", flush=True)
        time.sleep(2)

    print("\nDONE", flush=True)


if __name__ == "__main__":
    main()
