#!/usr/bin/env python3
"""
Score Google Search Console exports by business value.

Input can be a Search Console CSV zip export or an extracted export directory.
The script writes a page opportunity CSV and a short markdown summary.
"""

from __future__ import annotations

import argparse
import csv
import math
import re
import tempfile
import zipfile
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


MONEY_PATTERNS = [
    (5, re.compile(r"commercial|facility|facilities|fleet|multifamily|warehouse|retail", re.I)),
    (5, re.compile(r"ev|charger|charging|load-study|load studies|dc fast|level 2", re.I)),
    (5, re.compile(r"panel|zinsco|federal-pacific|fpe|service-upgrade|subpanel", re.I)),
    (4, re.compile(r"permit|inspection|code|title-24|ladbs|correction|compliance", re.I)),
    (4, re.compile(r"led|lighting|retrofit|recessed", re.I)),
    (3, re.compile(r"kitchen|dedicated-circuit|outlet|gfci|afci", re.I)),
]

LOW_VALUE_PATTERNS = [
    re.compile(r"bill|yes|산호세", re.I),
    re.compile(r"tesla|supercharger|volkswagen|walmart|news|2023|2025|2026", re.I),
    re.compile(r"byd|nacs|nevi|genesis|catl|autel|nayax|v2g|ports|grants|market-share", re.I),
    re.compile(r"record|expansion|launch|crisis|global-growth|developments|update", re.I),
]


@dataclass
class Row:
    key: str
    clicks: int
    impressions: int
    ctr: float
    position: float


def parse_percent(value: str) -> float:
    value = value.strip().replace("%", "")
    if not value:
        return 0.0
    return float(value) / 100.0


def read_rows(path: Path, filename: str, key_name: str) -> list[Row]:
    csv_path = path / filename
    rows: list[Row] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for item in reader:
            rows.append(
                Row(
                    key=item[key_name],
                    clicks=int(item["Clicks"].replace(",", "")),
                    impressions=int(item["Impressions"].replace(",", "")),
                    ctr=parse_percent(item["CTR"]),
                    position=float(item["Position"]),
                )
            )
    return rows


def business_value(text: str) -> int:
    if any(pattern.search(text) for pattern in LOW_VALUE_PATTERNS):
        return 1

    score = 2
    for value, pattern in MONEY_PATTERNS:
        if pattern.search(text):
            score = max(score, value)
    return score


def opportunity_score(row: Row, value: int) -> float:
    position_factor = 0.0
    if row.position <= 3:
        position_factor = 0.4
    elif row.position <= 10:
        position_factor = 1.0
    elif row.position <= 20:
        position_factor = 0.85
    elif row.position <= 40:
        position_factor = 0.35
    else:
        position_factor = 0.1

    ctr_gap = max(0.0, 0.025 - row.ctr)
    impression_factor = math.log10(max(row.impressions, 1) + 1)
    return round(value * position_factor * impression_factor * (1 + ctr_gap * 20), 3)


def recommended_action(row: Row, value: int) -> str:
    if value >= 5 and row.position <= 20 and row.ctr < 0.015:
        return "Rewrite title, meta, intro, CTA, and internal links"
    if value >= 4 and row.position <= 12 and row.ctr < 0.01:
        return "Improve snippet and add stronger hiring intent"
    if row.position > 20 and value >= 4:
        return "Expand content and add links from stronger pages"
    if value <= 1:
        return "Deprioritize unless it supports a money page"
    return "Monitor or improve after higher value pages"


def extract_input(input_path: Path) -> tuple[Path, tempfile.TemporaryDirectory[str] | None]:
    if input_path.is_dir():
        return input_path, None

    tmp = tempfile.TemporaryDirectory()
    with zipfile.ZipFile(input_path) as zf:
        zf.extractall(tmp.name)
    return Path(tmp.name), tmp


def page_path(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    return path if path.endswith("/") else f"{path}/"


def write_outputs(rows: list[dict[str, object]], output_csv: Path, output_md: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "rank",
        "url",
        "path",
        "clicks",
        "impressions",
        "ctr",
        "position",
        "business_value",
        "score",
        "action",
    ]
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    top = rows[:25]
    lines = [
        "# Search Console Business Opportunity Report",
        "",
        "Generated from the latest three month Search Console export.",
        "",
        "## Top Page Opportunities",
        "",
        "| Rank | Page | Clicks | Impressions | CTR | Position | Value | Score | Action |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
    ]
    for row in top:
        lines.append(
            "| {rank} | `{path}` | {clicks} | {impressions} | {ctr:.2%} | {position:.2f} | {business_value} | {score:.3f} | {action} |".format(
                **row
            )
        )
    lines.append("")
    lines.append("## Reading The Score")
    lines.append("")
    lines.append("Scores favor pages with business value, meaningful impressions, weak CTR, and rankings close enough to improve quickly.")
    lines.append("")
    output_md.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Search Console CSV zip or extracted directory")
    parser.add_argument("--output-csv", type=Path, default=Path("seo-updates/search-console-opportunities.csv"))
    parser.add_argument("--output-md", type=Path, default=Path("seo-updates/search-console-opportunities.md"))
    args = parser.parse_args()

    export_dir, tmp = extract_input(args.input)
    try:
        pages = read_rows(export_dir, "Pages.csv", "Top pages")
        scored = []
        for row in pages:
            path = page_path(row.key)
            value = business_value(path)
            score = opportunity_score(row, value)
            scored.append(
                {
                    "url": row.key,
                    "path": path,
                    "clicks": row.clicks,
                    "impressions": row.impressions,
                    "ctr": row.ctr,
                    "position": row.position,
                    "business_value": value,
                    "score": score,
                    "action": recommended_action(row, value),
                }
            )

        scored.sort(key=lambda item: item["score"], reverse=True)
        for index, row in enumerate(scored, 1):
            row["rank"] = index

        write_outputs(scored, args.output_csv, args.output_md)
        print(f"Wrote {args.output_csv}")
        print(f"Wrote {args.output_md}")
    finally:
        if tmp is not None:
            tmp.cleanup()


if __name__ == "__main__":
    main()
