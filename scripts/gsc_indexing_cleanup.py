#!/usr/bin/env python3
"""
Classify Google Search Console Page indexing drilldown exports.

Input files are Search Console CSV zip exports for Page with redirect and
Crawled currently not indexed. The output is a CSV plus a short markdown
summary that separates normal canonical behavior from pages that deserve SEO
work.
"""

from __future__ import annotations

import argparse
import csv
import re
import sqlite3
import tempfile
import zipfile
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


BASE_URL = "https://shaffercon.com"

MONEY_PATTERNS = [
    (5, re.compile(r"commercial|facility|facilities|fleet|multifamily|warehouse|retail", re.I)),
    (5, re.compile(r"ev|charger|charging|load-study|load-stud(y|ies)|dc-fast|level-2", re.I)),
    (5, re.compile(r"panel|service-upgrade|subpanel|zinsco|federal-pacific|fpe", re.I)),
    (4, re.compile(r"permit|inspection|code|title-24|ladbs|correction|compliance", re.I)),
    (4, re.compile(r"led|lighting|retrofit|recessed", re.I)),
    (3, re.compile(r"dedicated-equipment|gfci|afci|generator|troubleshooting", re.I)),
]

LOW_VALUE_PATTERNS = [
    re.compile(r"ceiling-fan|pool-hot-tub|smart-automation|data-network-av", re.I),
    re.compile(r"tesla|supercharger|volkswagen|walmart|byd|nacs|nevi|catl|autel|market-share", re.I),
    re.compile(r"record|expansion|launch|global-growth|q1|q2|q3|q4|2023|2024|2025|2026", re.I),
]


@dataclass(frozen=True)
class IndexingRow:
    issue: str
    url: str
    path: str
    last_crawled: str
    route_type: str
    business_value: int
    action: str


def extract_table(path: Path) -> tuple[Path, tempfile.TemporaryDirectory[str] | None]:
    if path.is_dir():
        return path / "Table.csv", None

    tmp = tempfile.TemporaryDirectory()
    with zipfile.ZipFile(path) as zf:
        zf.extractall(tmp.name)
    return Path(tmp.name) / "Table.csv", tmp


def canonical_path(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    if path == "/":
        return path
    return path if path.endswith("/") else f"{path}/"


def route_type(path: str) -> str:
    parts = [part for part in path.strip("/").split("/") if part]
    if len(parts) >= 3 and parts[0] == "service-areas":
        return "service_detail"
    if len(parts) == 2 and parts[0] == "service-areas":
        return "location"
    if len(parts) == 2 and parts[0] == "industry-insights":
        return "blog"
    if len(parts) == 1:
        return "top_level"
    return "other"


def service_detail_key(path: str) -> tuple[str, str] | None:
    parts = [part for part in path.strip("/").split("/") if part]
    if len(parts) < 3 or parts[0] != "service-areas":
        return None
    service = parts[2]
    if "-" not in service:
        return None
    service_type, service_name = service.split("-", 1)
    return service_type, service_name


def business_value(path: str) -> int:
    if any(pattern.search(path) for pattern in LOW_VALUE_PATTERNS):
        return 1

    score = 2
    for value, pattern in MONEY_PATTERNS:
        if pattern.search(path):
            score = max(score, value)
    return score


def read_rows(issue: str, input_path: Path) -> list[IndexingRow]:
    table, tmp = extract_table(input_path)
    try:
        rows: list[IndexingRow] = []
        with table.open(newline="", encoding="utf-8-sig") as fh:
            for item in csv.DictReader(fh):
                url = item["URL"]
                path = canonical_path(url)
                value = business_value(path)
                rows.append(
                    IndexingRow(
                        issue=issue,
                        url=url,
                        path=path,
                        last_crawled=item.get("Last crawled", ""),
                        route_type=route_type(path),
                        business_value=value,
                        action=recommended_action(issue, url, path, value),
                    )
                )
        return rows
    finally:
        if tmp is not None:
            tmp.cleanup()


def recommended_action(issue: str, url: str, path: str, value: int) -> str:
    parsed = urlparse(url)
    raw_path = parsed.path or "/"

    if issue == "Page with redirect" and raw_path != path:
        return "No action, canonical trailing slash redirect"

    if issue == "Crawled currently not indexed" and route_type(path) == "service_detail":
        if value >= 5:
            return "Priority, strengthen content and internal links"
        if value >= 4:
            return "Improve after top money pages"
        return "Deprioritize in sitemap and internal grids"

    if issue == "Crawled currently not indexed" and route_type(path) == "blog":
        if value >= 4:
            return "Consolidate into a stronger commercial page or refresh"
        return "Deprioritize or use only as support content"

    if value >= 4:
        return "Review manually"
    return "Low priority"


def load_current_service_pages(db_path: Path) -> set[str]:
    conn = sqlite3.connect(db_path)
    try:
        rows = conn.execute(
            """
            SELECT location, service_type, service_name
            FROM service_pages
            """
        ).fetchall()
    finally:
        conn.close()

    paths = set()
    for location, service_type, service_name in rows:
        location_slug = str(location).replace(" ", "-").lower()
        paths.add(f"/service-areas/{location_slug}/{service_type}-{service_name}/")
    return paths


def write_outputs(rows: list[IndexingRow], db_path: Path, output_csv: Path, output_md: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    service_paths = load_current_service_pages(db_path)
    counters = Counter(row.issue for row in rows)
    by_route = Counter(row.route_type for row in rows)
    by_action = Counter(row.action for row in rows)
    unique_rows: dict[tuple[str, str], IndexingRow] = {}
    for row in rows:
        key = (row.issue, row.path)
        current = unique_rows.get(key)
        if current is None or row.business_value > current.business_value:
            unique_rows[key] = row

    high_value = [
        row for row in unique_rows.values()
        if row.business_value >= 5 and "No action" not in row.action
    ]
    missing_service_paths = [
        row for row in rows
        if row.route_type == "service_detail" and row.path not in service_paths
    ]

    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "issue",
                "url",
                "canonical_path",
                "last_crawled",
                "route_type",
                "business_value",
                "action",
            ],
        )
        writer.writeheader()
        for row in sorted(rows, key=lambda item: (item.issue, -item.business_value, item.route_type, item.path)):
            writer.writerow(
                {
                    "issue": row.issue,
                    "url": row.url,
                    "canonical_path": row.path,
                    "last_crawled": row.last_crawled,
                    "route_type": row.route_type,
                    "business_value": row.business_value,
                    "action": row.action,
                }
            )

    lines = [
        "# GSC Indexing Cleanup Report",
        "",
        "Source, Search Console Page indexing exports from May 4, 2026.",
        "",
        "## Summary",
        "",
        f"Total exported rows reviewed, {len(rows)}",
        f"Unique issue plus canonical path rows, {len(unique_rows)}",
        f"Page with redirect rows, {counters['Page with redirect']}",
        f"Crawled currently not indexed rows, {counters['Crawled currently not indexed']}",
        f"High business value rows needing work, {len(high_value)}",
        f"Service detail rows not matching current generated routes, {len(missing_service_paths)}",
        "",
        "## Route Mix",
        "",
    ]
    for key, count in by_route.most_common():
        lines.append(f"{key}, {count}")

    lines.extend(["", "## Recommended Actions", ""])
    for key, count in by_action.most_common():
        lines.append(f"{key}, {count}")

    lines.extend(["", "## Top High Value URLs To Improve", ""])
    for row in high_value[:40]:
        lines.append(f"{row.business_value}, {row.issue}, `{row.path}`, {row.action}")

    lines.extend(
        [
            "",
            "## Interpretation",
            "",
            "Most Page with redirect examples are no slash URLs redirecting to the canonical slash URLs, that is normal with the current Next.js trailing slash setting.",
            "The larger opportunity is the crawled but not indexed set, which is mostly programmatic location plus service pages. Google is seeing many of them as low value or too similar, so the fastest business move is to emphasize EV charging, commercial electrical, panel upgrades, load studies, lighting, permits, inspections, and code correction pages.",
            "",
        ]
    )

    output_md.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--redirect", type=Path, required=True)
    parser.add_argument("--crawled", type=Path, required=True)
    parser.add_argument("--db", type=Path, default=Path("database/data/site.db"))
    parser.add_argument("--output-csv", type=Path, default=Path("seo-updates/gsc-indexing-2026-05-04/indexing-cleanup.csv"))
    parser.add_argument("--output-md", type=Path, default=Path("seo-updates/gsc-indexing-2026-05-04/indexing-cleanup.md"))
    args = parser.parse_args()

    rows = [
        *read_rows("Page with redirect", args.redirect),
        *read_rows("Crawled currently not indexed", args.crawled),
    ]
    write_outputs(rows, args.db, args.output_csv, args.output_md)
    print(f"Wrote {args.output_csv}")
    print(f"Wrote {args.output_md}")


if __name__ == "__main__":
    main()
