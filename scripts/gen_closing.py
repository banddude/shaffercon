#!/usr/bin/env python3
"""
Generate unique closing_content for shaffercon service pages.
Reads pages with empty closing_content, generates city-specific
content via `claude -p`, writes back to DB.

Usage:
  python3 gen_closing.py --limit 5            # generate 5 (test mode)
  python3 gen_closing.py --limit 5 --dry-run  # show prompts, don't write
  python3 gen_closing.py                      # all 563
"""
import argparse
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

DB_PATH = "/Users/mikeshaffer/AIVA/shaffercon/database/data/site.db"

# Landmarks per city — pulled from common knowledge of LA neighborhoods.
# Generator references these to keep content geographically grounded.
CITY_HINTS = {
    "altadena": "Eaton Fire rebuild zone, foothills, Christmas Tree Lane, Lake Avenue, Loma Alta, Farnsworth Park",
    "atwater village": "Glendale Boulevard, Atwater Village Theatre, the LA River, the Roost, Glendale freeway-adjacent commercial",
    "beverly hills": "Rodeo Drive, Wilshire Boulevard, Beverly Hills Hotel, Beverly Hilton, Greystone Mansion, Civic Center",
    "boyle heights": "Mariachi Plaza, Whittier Boulevard, First Street commercial, Hollenbeck Park, Sears Tower",
    "burbank": "Magnolia Boulevard, Media District, Empire Center, IKEA Burbank, Bob Hope Airport, the studios",
    "culver city": "Hayden Tract, Sony Pictures Studios, Culver Hotel, Helms Bakery District, Washington Boulevard, Platform LA",
    "echo park": "Echo Park Lake, Sunset Boulevard, Echo Park Avenue, Dodger Stadium-adjacent, Elysian Park",
    "glendale": "Americana at Brand, Glendale Galleria, Brand Boulevard, Adams Square, Forest Lawn",
    "highland park": "York Boulevard, Figueroa Street, Occidental College area, Highland Park Bowl, Galco Soda Pop Stop",
    "hollywood": "Hollywood Boulevard, Sunset Strip, Capitol Records, Walk of Fame, Hollywood Forever, Larchmont Village adjacent",
    "inglewood": "SoFi Stadium, Intuit Dome, The Forum, Hollywood Park, Manchester Boulevard, Crenshaw Boulevard",
    "long beach": "Pine Avenue, the Pike, Belmont Shore, Aquarium of the Pacific, Queen Mary, Port of Long Beach industrial",
    "los feliz": "Vermont Avenue, Hillhurst Avenue, Griffith Observatory, Greek Theatre, Los Feliz 3 Theatre",
    "pacific palisades": "Sunset Boulevard, Palisades Village, Will Rogers State Park, Asilomar bluffs, post-2025-Palisades-Fire rebuild zone",
    "pasadena": "Old Town, Colorado Boulevard, Rose Bowl, Caltech, City Hall, Eaton Fire affected northeast areas, Lake Avenue",
    "santa clarita": "Valencia, Newhall, Six Flags Magic Mountain, Westfield Valencia Town Center, Stevenson Ranch",
    "santa monica": "Third Street Promenade, Santa Monica Pier, Ocean Avenue, Bergamot Station, Lincoln Boulevard, Main Street",
    "sherman oaks": "Ventura Boulevard, Sherman Oaks Galleria, Westfield Fashion Square, Van Nuys Boulevard adjacent",
    "silver lake": "Sunset Boulevard, Silver Lake Reservoir, Sunset Junction, Hyperion Avenue, the LA River",
    "torrance": "Del Amo Fashion Center, Old Torrance, Madrona Marsh, Torrance Beach, Crenshaw Boulevard south",
    "venice": "Abbot Kinney Boulevard, Venice Boardwalk, Rose Avenue, Venice Canals, Lincoln Boulevard, Venice Beach",
    "west hollywood": "Sunset Strip, Melrose Avenue, Robertson Boulevard, the Pacific Design Center, Santa Monica Boulevard",
}

# Build a per-service-name lookup of typical concerns/talking points
SERVICE_CONTEXT = {
    "ev-charger-installation": "Level 2 EV chargers, panel capacity, conduit runs, Tesla Wall Connector / ChargePoint / Wallbox",
    "energy-efficiency-upgrades": "LED retrofits, smart controls, Title 24 compliance, SCE rebate programs, demand response",
    "electrical-panel-upgrades": "100A → 200A → 400A service upgrades, sub-panels, main service capacity",
    "backup-generator-installation": "whole-home standby generators, automatic transfer switches, natural gas hookups, PSPS preparedness",
    "electrical-troubleshooting-repairs": "diagnostic testing, intermittent issues, code corrections, GFCI/AFCI",
    "lighting-installation-retrofitting": "fixtures, LED conversion, dimmer compatibility, smart lighting",
    "complete-electrical-rewiring": "knob-and-tube replacement, aluminum wire remediation, full-home rewires",
    "data-network-av-wiring": "low-voltage, CAT6/CAT6A, structured wiring, AV pre-wires, smart home backbone",
    "whole-building-surge-protection": "Type 1/Type 2 SPDs, panel protection, sensitive electronics protection",
    "electrical-code-compliance-corrections": "permit corrections, retroactive compliance, sale-of-home corrections",
    "smart-automation-systems": "smart panels, lighting control, scenes, integration with Home Assistant / Control4",
    "breaker-panel-service-maintenance": "thermal imaging, torque checks, breaker testing, preventive replacements",
    "landscape-outdoor-lighting": "low-voltage path lighting, accent lighting, transformer sizing, weatherproofing",
    "security-motion-lighting": "motion sensors, security flood, dusk-to-dawn, perimeter lighting",
    "ceiling-fan-fixture-installation": "ceiling fan rough-ins, fixture upgrades, dimmer compatibility",
    "outlet-switch-dimmer-services": "outlet additions, dimmer upgrades, USB outlets, GFCI/AFCI receptacles",
    "pool-hot-tub-spa-electrical": "GFCI bonding, equipotential bonding, pool pump circuits, spa disconnects",
    "exhaust-fan-ventilation-wiring": "bath fans, kitchen hood, dedicated ventilation circuits",
    "dedicated-equipment-circuits": "dedicated 20A/30A/50A circuits, appliance dedicated runs",
    "electrical-safety-inspections": "thermal imaging, panel inspection, code review, insurance/sale inspections",
}


def get_pages_to_fill(conn, limit=None, location_filter=None):
    """Find service pages that need closing_content."""
    q = """
        SELECT sp.id, sp.location, sp.service_type, sp.service_name,
               sp.hero_intro,
               (SELECT GROUP_CONCAT(question, ' | ') FROM service_faqs
                WHERE service_page_id = sp.id) AS faqs,
               (SELECT GROUP_CONCAT(heading, ' | ') FROM service_benefits
                WHERE service_page_id = sp.id) AS benefits
        FROM service_pages sp
        WHERE (sp.closing_content IS NULL OR sp.closing_content = '')
    """
    params = []
    if location_filter:
        q += " AND sp.location = ?"
        params.append(location_filter)
    q += " ORDER BY sp.location, sp.service_name"
    if limit:
        q += f" LIMIT {int(limit)}"
    return conn.execute(q, params).fetchall()


def build_prompt(row):
    page_id, location, service_type, service_name, hero_intro, faqs, benefits = row
    service_display = service_name.replace('-', ' ').title()
    location_display = location.title()
    landmarks = CITY_HINTS.get(location, "")
    service_ctx = SERVICE_CONTEXT.get(service_name, "")

    return f"""You are writing the closing section for a service page on shaffercon.com (Los Angeles licensed electrical and general contractor).

CONTEXT
- Location: {location_display}
- Service: {service_type.title()} {service_display}
- Local landmarks/areas to optionally reference: {landmarks}
- Service-specific concerns: {service_ctx}
- Hero intro already on page: {hero_intro}
- FAQs already on page: {faqs or '(none)'}
- Benefit headings already on page: {benefits or '(none)'}

COMPANY FACTS
- Triple California CSLB license #994593: A (General Engineering), B (General Building), C-10 (Electrical) — most LA contractors only carry C-10
- 25+ years in Los Angeles, 1,000+ projects
- Owner-operated by Mike Shaffer (this means owner-led — DO NOT claim Mike personally runs every job, walks every panel, or is on-site for every project. He is not. Crews do the work; Shaffer Construction stands behind it.)
- In-house permitting and load studies (handled by the office, not outsourced)
- Phone (323) 642-8509, email hello@shaffercon.com
- For Altadena and Pasadena pages: Shaffer is actively doing Eaton Fire rebuild work. This is a major service line. Lean into it.
- For Pacific Palisades pages: Shaffer is actively doing Palisades Fire (January 2025) rebuild work. Same — lean in.

TASK
Write a 3-paragraph closing section, ~1000-1200 chars total. Structure:
1. Open with a compelling, specific vision of the service outcome for THIS particular {location_display} {service_type} property type. Reference real {location_display} landmarks or business types. If the location is Altadena, Pasadena, or Pacific Palisades, weave in fire-rebuild relevance where natural — this is a major service angle, not a footnote.
2. Explain why Shaffer is the right choice. Pick 2-3 differentiators from the COMPANY FACTS — don't dump all of them. Reference City of {location_display} permitting where relevant. Owner-operated means owner-led, not "owner does every job".
3. Close with a CTA: phone (323) 642-8509 and email hello@shaffercon.com. Make it inviting, not pushy.

HARD RULES
- DO NOT repeat content from the hero intro above.
- DO NOT use cliches: "in today's world", "rest assured", "look no further", "world-class", "second to none", "cutting-edge", "state-of-the-art".
- DO NOT use generic openings like "When it comes to..." or "At Shaffer Construction, we...".
- DO NOT claim Mike Shaffer personally runs every job, personally walks every panel, is on-site for every project, or is the one doing the work. That is false. Crews do the work. Shaffer Construction stands behind the work as a company.
- DO NOT say "you'll be talking to the owner" or "the owner is on every job".
- DO use em-dashes for emphasis. Contractions are fine.
- DO sound like a smart contractor talking to a savvy customer, not marketing copy.
- Output ONLY the 3 paragraphs. No headers. No markdown. No code blocks. Plain text with paragraph breaks (blank lines)."""


def gen_one(prompt, max_retries=4):
    """Run claude -p with retry + exponential backoff.

    Returns the generated text. Raises only after retries exhausted.
    """
    last_error = None
    for attempt in range(max_retries):
        try:
            result = subprocess.run(
                ["claude", "-p"],
                input=prompt,
                capture_output=True,
                text=True,
                timeout=180,
            )
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip()
            # Non-zero exit OR empty stdout — record and back off
            last_error = (
                f"exit={result.returncode}, "
                f"stdout_len={len(result.stdout)}, "
                f"stderr={result.stderr[:200]!r}"
            )
        except subprocess.TimeoutExpired:
            last_error = "timeout (180s)"

        # Exponential backoff: 15s, 30s, 60s, 120s
        if attempt < max_retries - 1:
            wait = 15 * (2 ** attempt)
            print(f"  ⚠️  attempt {attempt+1} failed ({last_error}); "
                  f"waiting {wait}s", file=sys.stderr)
            time.sleep(wait)

    raise RuntimeError(f"claude failed after {max_retries} attempts: {last_error}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--location", default=None, help="Filter to one location (e.g. 'beverly hills')")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--output-only", action="store_true",
                   help="Print generated content but don't write to DB")
    args = p.parse_args()

    conn = sqlite3.connect(DB_PATH)
    rows = get_pages_to_fill(conn, limit=args.limit, location_filter=args.location)
    print(f"Found {len(rows)} pages needing closing_content", file=sys.stderr)

    for i, row in enumerate(rows, 1):
        page_id, location, service_type, service_name = row[0], row[1], row[2], row[3]
        label = f"[{i}/{len(rows)}] {location} / {service_type}-{service_name}"
        print(f"\n{'='*70}\n{label}\n{'='*70}", file=sys.stderr)

        prompt = build_prompt(row)
        if args.dry_run:
            print(prompt[:500] + "...\n", file=sys.stderr)
            continue

        try:
            t0 = time.time()
            text = gen_one(prompt)
            elapsed = time.time() - t0
            print(f"Generated in {elapsed:.1f}s, {len(text)} chars\n", file=sys.stderr)
            print(text)
            print(f"\n--- end {label} ---\n", file=sys.stderr)

            if not args.output_only:
                conn.execute(
                    "UPDATE service_pages SET closing_content = ? WHERE id = ?",
                    (text, page_id)
                )
                conn.commit()
                print(f"✓ Wrote to DB (id={page_id})", file=sys.stderr)
            # Throttle between calls to avoid rate-limit spikes
            time.sleep(3)
        except Exception as e:
            print(f"✗ Error after retries: {e}", file=sys.stderr)
            # On error, wait longer before next attempt
            time.sleep(30)
            continue


if __name__ == "__main__":
    main()
