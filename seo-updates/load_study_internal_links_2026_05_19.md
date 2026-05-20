# Load Study Internal Links, May 19, 2026

Target page, `/electrical-load-studies/`.

| Source | Link count | Anchor evidence | Reason |
| --- | ---: | --- | --- |
| `content/industry-insights/ladbs-electrical-permit-process-step-by-step-guide.json` | 2 | <a href="/electrical-load-studies/">electrical load study</a> | Permit application and plan check pages pass authority to load study service. |
| `content/industry-insights/california-title-24-electrical-requirements-renovations.json` | 1 | <a href="/electrical-load-studies/">electrical load study in Los Angeles</a> | Renovation code pages catch capacity questions before construction. |
| `content/industry-insights/complete-guide-electrical-panel-upgrades-los-angeles.json` | 1 | <a href="/electrical-load-studies/">Los Angeles electrical load study</a> | Panel upgrade readers often need capacity proof before replacing equipment. |
| `content/industry-insights/do-i-need-panel-upgrade-install-ev-charger.json` | 1 | <a href="/electrical-load-studies/">electrical load study</a> | EV charger readers need to know whether a panel upgrade is actually required. |
| `content/industry-insights/commercial-electrical-systems-navigating-the-complexities.json` | 1 | <a href="/electrical-load-studies/">electrical load studies</a> | Commercial owners need measured demand before equipment or tenant load changes. |
| `content/industry-insights/commercial-ev-charging-stations-roi-guide-los-angeles.json` | 1 | <a href="/electrical-load-studies/">load studies</a> | Commercial EV buyers need feasibility and utility capacity before ROI math is real. |
| `content/industry-insights/passing-electrical-inspection-common-failures-fixes.json` | 1 | <a href="/electrical-load-studies/">electrical load study</a> | Inspection correction readers may need measured capacity before resubmittal. |
| `content/industry-insights/electrical-safety-inspection-checklist-los-angeles.json` | 1 | <a href="/electrical-load-studies/">electrical load study</a> | Safety inspection readers planning new loads need capacity validation. |

## Changes Made This Session

1. Added a contextual load study link to `passing-electrical-inspection-common-failures-fixes.json` before the conclusion section.
2. Added a contextual load study link to `electrical-safety-inspection-checklist-los-angeles.json` before the conclusion section.
3. Confirmed existing load study links from LADBS, Title 24, panel upgrade, EV charger panel upgrade, commercial electrical systems, and commercial EV ROI content.

## Verification

Run `jq -r .content <file> | rg "/electrical-load-studies/"` for each source file to confirm links are present.
