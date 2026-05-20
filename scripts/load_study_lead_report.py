#!/usr/bin/env python3
"""
Generate a lead quality report from the GitHub leads branch.

The contact form stores submissions as JSON files on origin/leads. Newer leads
include jobCategory, leadQuality, spamAssessment, and loadStudyIntake. Older
leads do not, so this script applies a small legacy classifier to make the last
30 days readable without mutating any lead data.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_OUTPUT = Path("seo-updates/load_study_lead_report_2026_05_19.md")
DATE_FMT = "%Y-%m-%dT%H:%M:%SZ"


@dataclass
class Lead:
    file: str
    timestamp: datetime | None
    name: str
    email: str
    phone: str
    message: str
    page: str
    landing: str
    job_category: str
    lead_quality: str
    spam_score: int
    spam_reasons: list[str]
    load_study_intake: dict[str, str]


def git_output(args: list[str]) -> str:
    return subprocess.check_output(["git", *args], text=True)


def parse_timestamp(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.strptime(value, DATE_FMT).replace(tzinfo=timezone.utc)
    except ValueError:
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None


def clean_text(value: Any) -> str:
    if not isinstance(value, str):
        return ""
    return re.sub(r"\s+", " ", value).strip()


def classify_legacy(item: dict[str, Any]) -> tuple[str, str, int, list[str]]:
    text = " ".join(
        clean_text(item.get(key))
        for key in ["firstName", "lastName", "email", "phone", "address", "message"]
    ).lower()
    attribution = item.get("attribution") or {}
    if isinstance(attribution, dict):
        text += " " + " ".join(clean_text(v).lower() for v in attribution.values())

    reasons: list[str] = []
    score = 0
    job_category = "unknown"
    lead_quality = "needs_review"

    if any(term in text for term in ["electrical-load-studies", "load study", "load studies", "capacity study", "load calculation"]):
        job_category = "electrical_load_studies"

    spam_patterns = [
        ("seo_vendor_pitch", 6, ["seo analysis", "website ranking", "ranking on google", "rank higher", "search engines", "online visibility", "targeted traffic", "local market online", "backlinks"]),
        ("estimating_vendor_pitch", 6, ["cost estimates", "cost estimation", "quantity takeoff", "quantity take off", "pure estimating", "professionalestimating", "professional estimating"]),
        ("business_broker_pitch", 6, ["business broker", "selling your business", "sell your business", "private equity", "valuation of your business"]),
        ("outsourced_services_pitch", 5, ["virtual assistant", "lead generation", "appointment setting"]),
        ("job_seeker", 4, ["electrical trainee", "seeking opportunity", "looking for work", "resume"]),
    ]

    for reason, points, terms in spam_patterns:
        if any(term in text for term in terms):
            reasons.append(reason)
            score += points

    if "1234567890" in text:
        reasons.append("fake_phone_number")
        score += 5

    if any(reason.endswith("_pitch") for reason in reasons):
        lead_quality = "vendor_spam"
    elif "job_seeker" in reasons:
        lead_quality = "job_seeker"
    elif job_category != "unknown":
        lead_quality = "potential_customer"

    return job_category, lead_quality, score, reasons


def read_leads(branch: str) -> list[Lead]:
    files = [
        line
        for line in git_output(["ls-tree", "-r", "--name-only", branch]).splitlines()
        if line.startswith("leads/") and line.endswith(".json")
    ]
    leads: list[Lead] = []

    for file in files:
        raw = git_output(["show", f"{branch}:{file}"])
        try:
            item = json.loads(raw)
        except json.JSONDecodeError:
            continue

        attribution = item.get("attribution") or {}
        if not isinstance(attribution, dict):
            attribution = {}
        spam = item.get("spamAssessment") or {}
        if not isinstance(spam, dict):
            spam = {}
        intake = item.get("loadStudyIntake") or {}
        if not isinstance(intake, dict):
            intake = {}

        job_category = clean_text(item.get("jobCategory"))
        lead_quality = clean_text(item.get("leadQuality"))
        spam_score = int(spam.get("score") or 0)
        spam_reasons = [clean_text(reason) for reason in spam.get("reasons") or [] if clean_text(reason)]

        if not job_category or not lead_quality:
            job_category, lead_quality, spam_score, spam_reasons = classify_legacy(item)

        leads.append(
            Lead(
                file=file,
                timestamp=parse_timestamp(item.get("timestamp")),
                name=clean_text(f"{item.get('firstName', '')} {item.get('lastName', '')}"),
                email=clean_text(item.get("email")),
                phone=clean_text(item.get("phone")),
                message=clean_text(item.get("message")),
                page=clean_text(attribution.get("pagePath") or attribution.get("pageUrl")),
                landing=clean_text(attribution.get("landingPage")),
                job_category=job_category or "unknown",
                lead_quality=lead_quality or "needs_review",
                spam_score=spam_score,
                spam_reasons=spam_reasons,
                load_study_intake={key: clean_text(value) for key, value in intake.items()},
            )
        )

    return sorted(leads, key=lambda lead: lead.timestamp or datetime.min.replace(tzinfo=timezone.utc), reverse=True)


def filtered_recent(leads: list[Lead], days: int, now: datetime) -> list[Lead]:
    cutoff = now.timestamp() - days * 24 * 60 * 60
    return [
        lead
        for lead in leads
        if lead.timestamp is None or lead.timestamp.timestamp() >= cutoff
    ]


def pct(value: int, total: int) -> str:
    if total <= 0:
        return "0.0%"
    return f"{value / total * 100:.1f}%"


def render_report(leads: list[Lead], days: int, branch: str) -> str:
    total = len(leads)
    by_quality = Counter(lead.lead_quality for lead in leads)
    by_category = Counter(lead.job_category for lead in leads)
    by_reason: Counter[str] = Counter()
    for lead in leads:
        by_reason.update(lead.spam_reasons)

    load_study = [lead for lead in leads if lead.job_category == "electrical_load_studies"]
    potential = [lead for lead in leads if lead.lead_quality == "potential_customer"]
    lines = [
        "# Load Study Lead Quality Report",
        "",
        f"Generated from `{branch}`.",
        "",
        f"Window, last {days} days.",
        "",
        "## Summary",
        "",
        f"Total leads reviewed, {total}.",
        "",
        f"Potential customer leads, {by_quality.get('potential_customer', 0)} ({pct(by_quality.get('potential_customer', 0), total)}).",
        f"Load study leads, {len(load_study)} ({pct(len(load_study), total)}).",
        f"Vendor spam leads, {by_quality.get('vendor_spam', 0)} ({pct(by_quality.get('vendor_spam', 0), total)}).",
        f"Job seeker leads, {by_quality.get('job_seeker', 0)} ({pct(by_quality.get('job_seeker', 0), total)}).",
        f"Needs review or unknown, {by_quality.get('needs_review', 0) + by_quality.get('unknown', 0)}.",
        "",
        "## By Job Category",
        "",
        "| Job category | Count |",
        "| --- | ---: |",
    ]

    for key, count in by_category.most_common():
        lines.append(f"| `{key}` | {count} |")

    lines.extend([
        "",
        "## By Lead Quality",
        "",
        "| Lead quality | Count |",
        "| --- | ---: |",
    ])
    for key, count in by_quality.most_common():
        lines.append(f"| `{key}` | {count} |")

    lines.extend([
        "",
        "## Spam Reasons",
        "",
        "| Reason | Count |",
        "| --- | ---: |",
    ])
    if by_reason:
        for key, count in by_reason.most_common():
            lines.append(f"| `{key}` | {count} |")
    else:
        lines.append("| None recorded | 0 |")

    lines.extend([
        "",
        "## Potential Customer Leads",
        "",
        "| Date | Name | Email | Category | Source | Notes |",
        "| --- | --- | --- | --- | --- | --- |",
    ])
    if potential:
        for lead in potential[:20]:
            date = lead.timestamp.strftime("%Y-%m-%d") if lead.timestamp else "unknown"
            note = lead.message[:120].replace("|", "\\|")
            lines.append(f"| {date} | {lead.name} | `{lead.email}` | `{lead.job_category}` | `{lead.page or lead.landing}` | {note} |")
    else:
        lines.append("| None |  |  |  |  |  |")

    lines.extend([
        "",
        "## Recent Lead Detail",
        "",
        "| Date | Name | Email | Quality | Category | Spam reasons |",
        "| --- | --- | --- | --- | --- | --- |",
    ])
    for lead in leads[:30]:
        date = lead.timestamp.strftime("%Y-%m-%d") if lead.timestamp else "unknown"
        reasons = ", ".join(f"`{reason}`" for reason in lead.spam_reasons) or "none"
        lines.append(f"| {date} | {lead.name} | `{lead.email}` | `{lead.lead_quality}` | `{lead.job_category}` | {reasons} |")

    lines.extend([
        "",
        "## Verification",
        "",
        "This report is generated from lead JSON on the GitHub `leads` branch. It does not mutate lead data.",
    ])

    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a load study lead quality report.")
    parser.add_argument("--branch", default="origin/leads")
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    leads = filtered_recent(read_leads(args.branch), args.days, datetime.now(timezone.utc))
    report = render_report(leads, args.days, args.branch)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(report, encoding="utf-8")
    print(f"Wrote {args.output} with {len(leads)} leads")


if __name__ == "__main__":
    main()
