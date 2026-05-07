#!/usr/bin/env python3
"""
Score Google Search Console exports by business value and internal link need.

Input can be a Search Console CSV zip export or an extracted export directory
containing Pages.csv, Queries.csv, and QueryPages.csv. The script writes:

1. Page opportunity CSV and markdown summary.
2. Internal linking plan CSV and markdown summary.

The scoring favors pages that already have impressions and rankings close
enough to improve, especially pages tied to EV charging, commercial electrical,
panel work, load studies, permitting, and code compliance.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sqlite3
import tempfile
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


BASE_URL = "https://shaffercon.com"
POST_DIR = Path("content/industry-insights")
DB_PATH = Path("database/data/site.db")

MONEY_PATTERNS = [
    (5, re.compile(r"commercial|facility|facilities|fleet|multifamily|warehouse|retail", re.I)),
    (5, re.compile(r"ev|charger|charging|load-study|load studies|dc fast|level 2", re.I)),
    (5, re.compile(r"panel|zinsco|federal-pacific|fpe|service-upgrade|subpanel", re.I)),
    (4, re.compile(r"permit|inspection|code|title-24|ladbs|correction|compliance", re.I)),
    (4, re.compile(r"led|lighting|retrofit|recessed", re.I)),
    (3, re.compile(r"kitchen|dedicated-circuit|outlet|gfci|afci|generator|troubleshooting", re.I)),
]

LOW_VALUE_PATTERNS = [
    re.compile(r"bill|yes|산호세", re.I),
    re.compile(r"tesla|supercharger|volkswagen|walmart|news|2023|2025|2026", re.I),
    re.compile(r"byd|nacs|nevi|genesis|catl|autel|nayax|v2g|ports|grants|market-share", re.I),
    re.compile(r"record|expansion|launch|crisis|global-growth|developments|update", re.I),
]

COMMON_WORDS = {
    "about",
    "after",
    "also",
    "and",
    "are",
    "can",
    "for",
    "from",
    "has",
    "have",
    "how",
    "into",
    "los",
    "angeles",
    "near",
    "need",
    "news",
    "our",
    "page",
    "service",
    "services",
    "shaffer",
    "that",
    "the",
    "this",
    "through",
    "what",
    "when",
    "where",
    "which",
    "with",
    "your",
}

MONEY_PAGE_PATHS = {
    "/commercial-electric-vehicle-chargers/",
    "/residential-ev-charger/",
    "/electrical-load-studies/",
    "/commercial-service/",
    "/led-retrofit-services/",
    "/statewide-facilities-maintenance/",
    "/contact-us/",
}


@dataclass
class GscRow:
    key: str
    clicks: int
    impressions: int
    ctr: float
    position: float


@dataclass
class QueryPageRow:
    query: str
    page: str
    path: str
    clicks: int
    impressions: int
    ctr: float
    position: float


@dataclass
class CorpusPage:
    path: str
    title: str
    text: str
    route_type: str


def parse_percent(value: str) -> float:
    value = value.strip().replace("%", "")
    if not value:
        return 0.0
    return float(value) / 100.0


def clean_number(value: str) -> int:
    return int(value.replace(",", "").strip() or "0")


def read_rows(path: Path, filename: str, key_name: str) -> list[GscRow]:
    csv_path = path / filename
    rows: list[GscRow] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for item in reader:
            rows.append(
                GscRow(
                    key=item[key_name],
                    clicks=clean_number(item["Clicks"]),
                    impressions=clean_number(item["Impressions"]),
                    ctr=parse_percent(item["CTR"]),
                    position=float(item["Position"]),
                )
            )
    return rows


def read_query_page_rows(path: Path) -> list[QueryPageRow]:
    csv_path = path / "QueryPages.csv"
    if not csv_path.exists():
        return []

    rows: list[QueryPageRow] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for item in reader:
            url = item["Page"]
            rows.append(
                QueryPageRow(
                    query=item["Query"],
                    page=url,
                    path=page_path(url),
                    clicks=clean_number(item["Clicks"]),
                    impressions=clean_number(item["Impressions"]),
                    ctr=parse_percent(item["CTR"]),
                    position=float(item["Position"]),
                )
            )
    return rows


def weighted_position(rows: list[GscRow]) -> float:
    total_impressions = sum(row.impressions for row in rows)
    if total_impressions <= 0:
        return round(sum(row.position for row in rows) / max(len(rows), 1), 2)
    return round(sum(row.position * row.impressions for row in rows) / total_impressions, 2)


def aggregate_pages(pages: list[GscRow]) -> list[GscRow]:
    grouped: dict[str, list[GscRow]] = defaultdict(list)
    for row in pages:
        grouped[page_path(row.key)].append(row)

    aggregated: list[GscRow] = []
    for path, rows in grouped.items():
        clicks = sum(row.clicks for row in rows)
        impressions = sum(row.impressions for row in rows)
        ctr = clicks / impressions if impressions else 0.0
        aggregated.append(
            GscRow(
                key=f"{BASE_URL}{path}",
                clicks=clicks,
                impressions=impressions,
                ctr=ctr,
                position=weighted_position(rows),
            )
        )
    return aggregated


def business_value(text: str) -> int:
    if any(pattern.search(text) for pattern in LOW_VALUE_PATTERNS):
        return 1

    score = 2
    for value, pattern in MONEY_PATTERNS:
        if pattern.search(text):
            score = max(score, value)
    return score


def expected_ctr(position: float) -> float:
    if position <= 3:
        return 0.08
    if position <= 5:
        return 0.05
    if position <= 10:
        return 0.025
    if position <= 20:
        return 0.012
    if position <= 40:
        return 0.004
    return 0.001


def opportunity_score(row: GscRow, value: int) -> float:
    if row.impressions <= 0:
        return 0.0
    position_factor = 0.0
    if row.position <= 3:
        position_factor = 0.35
    elif row.position <= 10:
        position_factor = 1.0
    elif row.position <= 20:
        position_factor = 0.85
    elif row.position <= 40:
        position_factor = 0.35
    else:
        position_factor = 0.1

    ctr_gap = max(0.0, expected_ctr(row.position) - row.ctr)
    missed_clicks = max(0.0, row.impressions * ctr_gap)
    impression_factor = math.log10(row.impressions + 1)
    return round(value * position_factor * impression_factor * (1 + min(missed_clicks, 500) / 100), 3)


def classify_route(path: str) -> str:
    parts = [part for part in path.strip("/").split("/") if part]
    if path == "/":
        return "home"
    if len(parts) == 1:
        return "landing"
    if len(parts) == 2 and parts[0] == "industry-insights":
        return "blog"
    if len(parts) == 2 and parts[0] == "service-areas":
        return "location"
    if len(parts) >= 3 and parts[0] == "service-areas":
        return "service_detail"
    return "other"


def recommended_action(row: GscRow, value: int, route_type: str) -> str:
    if value <= 1:
        return "Deprioritize unless it supports a money page"
    if row.position <= 12 and row.ctr < expected_ctr(row.position) * 0.45:
        return "CTR fix, rewrite title and meta around proven queries"
    if row.position <= 20 and route_type in {"service_detail", "blog", "landing"}:
        return "Ranking lift, add internal links and local proof"
    if row.position > 20 and value >= 4:
        return "Content lift, expand page and add links from stronger pages"
    return "Monitor after higher value pages"


def primary_need(row: GscRow) -> str:
    if row.ctr < expected_ctr(row.position) * 0.45 and row.position <= 12:
        return "ctr"
    if row.position <= 20:
        return "links"
    return "content"


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
    if path == "/":
        return path
    return path if path.endswith("/") else f"{path}/"


def top_queries_for_path(query_pages: list[QueryPageRow], path: str, limit: int = 8) -> list[QueryPageRow]:
    rows = [row for row in query_pages if row.path == path]
    rows.sort(key=lambda row: (row.impressions, row.clicks), reverse=True)
    return rows[:limit]


def tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-z0-9]+", text.lower())
        if len(token) > 2 and token not in COMMON_WORDS
    }


def clean_html(value: str) -> str:
    return re.sub(r"<[^>]+>", " ", value or "")


def load_corpus(repo: Path) -> list[CorpusPage]:
    corpus: list[CorpusPage] = [
        CorpusPage("/", "Homepage", "Shaffer Construction Los Angeles electrical contractor EV charging panel upgrades load studies commercial service", "home"),
        CorpusPage("/commercial-electric-vehicle-chargers/", "Commercial EV Charger Installation", "commercial EV charger installation fleet charging multifamily retail workplace DC fast charging load studies", "landing"),
        CorpusPage("/residential-ev-charger/", "Residential EV Charger Installation", "home EV charger installation Level 2 charger panel capacity load calculation residential garage", "landing"),
        CorpusPage("/electrical-load-studies/", "Electrical Load Studies", "electrical load studies EV charger planning service capacity permit utility coordination panel upgrade", "landing"),
        CorpusPage("/commercial-service/", "Commercial Electrical Service", "commercial electrical service tenant improvement troubleshooting dedicated circuits panels lighting", "landing"),
        CorpusPage("/led-retrofit-services/", "LED Retrofit Services", "LED retrofit lighting installation commercial lighting energy efficiency rebate", "landing"),
        CorpusPage("/contact-us/", "Contact Shaffer Construction", "contact Shaffer Construction quote estimate electrical contractor Los Angeles", "landing"),
    ]

    for path in sorted((repo / POST_DIR).glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        slug = data.get("slug") or path.stem
        corpus.append(
            CorpusPage(
                path=f"/industry-insights/{slug}/",
                title=str(data.get("title") or data.get("metaTitle") or slug),
                text=" ".join(
                    [
                        str(data.get("title", "")),
                        str(data.get("metaTitle", "")),
                        str(data.get("metaDescription", "")),
                        clean_html(str(data.get("content", ""))),
                    ]
                ),
                route_type="blog",
            )
        )

    db_path = repo / DB_PATH
    if not db_path.exists():
        return corpus

    conn = sqlite3.connect(db_path)
    try:
        for row in conn.execute(
            """
            SELECT lp.location_slug, lp.location_name, lp.tagline,
                   lp.about_paragraph_1, lp.about_paragraph_2,
                   lp.residential_intro, lp.commercial_intro
            FROM location_pages lp
            """
        ).fetchall():
            slug, name, tagline, about_1, about_2, residential, commercial = row
            corpus.append(
                CorpusPage(
                    path=f"/service-areas/{slug}/",
                    title=f"Electrical Services in {name}",
                    text=" ".join(str(part or "") for part in [name, tagline, about_1, about_2, residential, commercial]),
                    route_type="location",
                )
            )

        for row in conn.execute(
            """
            SELECT sp.location, sp.service_type, sp.service_name, sp.hero_intro,
                   sp.closing_content, sp.offerings_intro, pa.title, pa.meta_description
            FROM service_pages sp
            LEFT JOIN pages_all pa ON pa.id = sp.page_id
            """
        ).fetchall():
            location, service_type, service_name, hero, closing, offerings, title, meta = row
            location_slug = str(location).replace(" ", "-").lower()
            path = f"/service-areas/{location_slug}/{service_type}-{service_name}/"
            corpus.append(
                CorpusPage(
                    path=path,
                    title=str(title or f"{service_type} {service_name} in {location}"),
                    text=" ".join(str(part or "") for part in [location, service_type, service_name, hero, closing, offerings, title, meta]),
                    route_type="service_detail",
                )
            )
    finally:
        conn.close()

    return corpus


def source_strength(path_metrics: dict[str, dict[str, object]], path: str) -> float:
    metrics = path_metrics.get(path)
    if not metrics:
        return 1.0
    return 1 + math.log10(int(metrics.get("impressions", 0)) + int(metrics.get("clicks", 0)) + 1)


def choose_anchor(target: dict[str, object], query_rows: list[QueryPageRow]) -> str:
    for row in query_rows:
        query = row.query.strip().lower()
        if 3 <= len(query.split()) <= 7 and not any(term in query for term in ("shaffer", "schaffer", "yes")):
            return query
    return str(target["path"]).strip("/").split("/")[-1].replace("-", " ")


def internal_link_plan(
    opportunities: list[dict[str, object]],
    query_pages: list[QueryPageRow],
    corpus: list[CorpusPage],
    limit_targets: int = 25,
    links_per_target: int = 5,
) -> list[dict[str, object]]:
    corpus_by_path = {page.path: page for page in corpus}
    path_metrics = {str(row["path"]): row for row in opportunities}
    plan: list[dict[str, object]] = []

    targets = [
        row
        for row in opportunities
        if int(row["business_value"]) >= 4 and str(row["action"]) != "Deprioritize unless it supports a money page"
    ][:limit_targets]

    for target in targets:
        target_path = str(target["path"])
        query_rows = top_queries_for_path(query_pages, target_path, limit=8)
        target_terms = tokens(
            " ".join(
                [
                    target_path.replace("-", " "),
                    " ".join(row.query for row in query_rows),
                    corpus_by_path.get(target_path, CorpusPage(target_path, "", "", "other")).title,
                ]
            )
        )
        if not target_terms:
            continue

        candidates = []
        for source in corpus:
            if source.path == target_path or source.path in MONEY_PAGE_PATHS:
                continue
            source_terms = tokens(f"{source.title} {source.text}")
            overlap = len(target_terms & source_terms)
            if overlap <= 1:
                continue
            route_bonus = {"blog": 1.25, "location": 1.0, "service_detail": 0.75, "landing": 0.7, "home": 0.6}.get(source.route_type, 0.5)
            score = round(overlap * route_bonus * source_strength(path_metrics, source.path), 3)
            candidates.append((score, source))

        candidates.sort(key=lambda item: item[0], reverse=True)
        anchor = choose_anchor(target, query_rows)
        for score, source in candidates[:links_per_target]:
            plan.append(
                {
                    "target_rank": target["rank"],
                    "target_path": target_path,
                    "target_score": target["score"],
                    "target_action": target["action"],
                    "source_path": source.path,
                    "source_type": source.route_type,
                    "anchor": anchor,
                    "link_score": score,
                }
            )

    return plan


def write_opportunity_outputs(
    rows: list[dict[str, object]],
    query_pages: list[QueryPageRow],
    output_csv: Path,
    output_md: Path,
) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "rank",
        "url",
        "path",
        "route_type",
        "clicks",
        "impressions",
        "ctr",
        "expected_ctr",
        "missed_clicks",
        "position",
        "business_value",
        "score",
        "need",
        "top_queries",
        "action",
    ]
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    by_need = Counter(str(row["need"]) for row in rows[:100])
    by_route = Counter(str(row["route_type"]) for row in rows[:100])
    total_missed = sum(float(row["missed_clicks"]) for row in rows[:50])

    lines = [
        "# Search Console SEO Opportunity Report",
        "",
        "Generated from the latest Search Console export available in the repo.",
        "",
        "## Summary",
        "",
        f"Unique pages scored, {len(rows)}",
        f"Estimated missed clicks across top 50, {total_missed:.1f}",
        "",
        "## Top 25 Page Opportunities",
        "",
        "| Rank | Page | Clicks | Impressions | CTR | Expected CTR | Position | Value | Need | Score | Action |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |",
    ]
    for row in rows[:25]:
        lines.append(
            "| {rank} | `{path}` | {clicks} | {impressions} | {ctr:.2%} | {expected_ctr:.2%} | {position:.2f} | {business_value} | {need} | {score:.3f} | {action} |".format(
                **row
            )
        )
        query_list = [q.query for q in top_queries_for_path(query_pages, str(row["path"]), limit=5)]
        if query_list:
            lines.append(f"|  | queries, {', '.join(query_list[:5])} |  |  |  |  |  |  |  |  |  |")

    lines.extend(["", "## Top 100 Need Mix", ""])
    for key, count in by_need.most_common():
        lines.append(f"{key}, {count}")

    lines.extend(["", "## Top 100 Route Mix", ""])
    for key, count in by_route.most_common():
        lines.append(f"{key}, {count}")

    lines.extend(
        [
            "",
            "## Reading The Score",
            "",
            "Scores favor pages with business value, meaningful impressions, weak CTR against current position, and rankings close enough to improve quickly.",
            "Need `ctr` means rewrite title and meta first. Need `links` means add internal links from related pages. Need `content` means expand the page before expecting movement.",
            "",
        ]
    )
    output_md.write_text("\n".join(lines), encoding="utf-8")


def write_link_outputs(plan: list[dict[str, object]], output_csv: Path, output_md: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "target_rank",
        "target_path",
        "target_score",
        "target_action",
        "source_path",
        "source_type",
        "anchor",
        "link_score",
    ]
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(plan)

    lines = [
        "# Search Console Internal Linking Plan",
        "",
        "Targets come from Search Console opportunity scoring. Sources are selected from existing pages and posts by topical overlap and available Search Console strength.",
        "",
        "## Top Link Actions",
        "",
        "| Target Rank | Target | Source | Anchor | Link Score |",
        "| ---: | --- | --- | --- | ---: |",
    ]
    for row in plan[:80]:
        lines.append(
            "| {target_rank} | `{target_path}` | `{source_path}` | {anchor} | {link_score:.3f} |".format(
                **row
            )
        )

    output_md.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Search Console CSV zip or extracted directory")
    parser.add_argument("--repo", type=Path, default=Path("."))
    parser.add_argument("--output-csv", type=Path, default=Path("seo-updates/search-console-opportunities.csv"))
    parser.add_argument("--output-md", type=Path, default=Path("seo-updates/search-console-opportunities.md"))
    parser.add_argument("--links-csv", type=Path, default=Path("seo-updates/search-console-internal-links.csv"))
    parser.add_argument("--links-md", type=Path, default=Path("seo-updates/search-console-internal-links.md"))
    args = parser.parse_args()

    export_dir, tmp = extract_input(args.input)
    try:
        pages = aggregate_pages(read_rows(export_dir, "Pages.csv", "Top pages"))
        query_pages = read_query_page_rows(export_dir)
        scored = []
        for row in pages:
            path = page_path(row.key)
            query_rows = top_queries_for_path(query_pages, path, limit=8)
            query_text = " ".join(query.query for query in query_rows)
            value = max(business_value(path), business_value(query_text))
            exp_ctr = expected_ctr(row.position)
            missed_clicks = max(0.0, row.impressions * exp_ctr - row.clicks)
            route_type = classify_route(path)
            action = recommended_action(row, value, route_type)
            scored.append(
                {
                    "url": f"{BASE_URL}{path}",
                    "path": path,
                    "route_type": route_type,
                    "clicks": row.clicks,
                    "impressions": row.impressions,
                    "ctr": row.ctr,
                    "expected_ctr": exp_ctr,
                    "missed_clicks": round(missed_clicks, 1),
                    "position": row.position,
                    "business_value": value,
                    "score": opportunity_score(row, value),
                    "need": primary_need(row),
                    "top_queries": "; ".join(query.query for query in query_rows[:5]),
                    "action": action,
                }
            )

        scored.sort(key=lambda item: item["score"], reverse=True)
        for index, row in enumerate(scored, 1):
            row["rank"] = index

        repo = args.repo.resolve()
        corpus = load_corpus(repo)
        plan = internal_link_plan(scored, query_pages, corpus)

        write_opportunity_outputs(scored, query_pages, args.output_csv, args.output_md)
        write_link_outputs(plan, args.links_csv, args.links_md)
        print(f"Wrote {args.output_csv}")
        print(f"Wrote {args.output_md}")
        print(f"Wrote {args.links_csv}")
        print(f"Wrote {args.links_md}")
    finally:
        if tmp is not None:
            tmp.cleanup()


if __name__ == "__main__":
    main()
