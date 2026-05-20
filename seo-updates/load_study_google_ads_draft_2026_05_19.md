# Load Study Google Ads Draft, May 19, 2026

Status, draft only.

Do not launch yet.

Reason, the site has Search Console proof that load study and electrical capacity searches exist, but GA4 has 0 `qualified_lead` events for the last complete 7 day window and recent GitHub lead data shows 0 accepted load study leads. The right move is to prepare a narrow campaign now, then launch only after the new intake path and `qualified_lead` tracking are verified in live data.

Primary landing page, `/electrical-load-studies/`.

Primary conversion, `qualified_lead`.

Secondary evidence, accepted GitHub lead JSON with `jobCategory` equal to `electrical_load_studies` and `leadQuality` equal to `potential_customer`.

## Launch Gates

1. GA4 custom dimension `service_category` is registered and visible in reports.
2. At least one live form submission or test path verifies the load study intake payload reaches the GitHub lead JSON.
3. `qualified_lead` appears in GA4 after the May 19 tracking update.
4. Spam suppression remains active, obvious vendor spam returns `accepted:false`.
5. Budget owner approves a small test after reviewing this draft.

## Campaign

Campaign name, `Load Studies, Los Angeles`.

Goal, qualified load study inquiries for EV charger installs, tenant improvements, panel upgrades, utility planning, and permit work.

Network, Google Search only.

Locations, Los Angeles County, with emphasis on service areas already on the site.

Location setting, presence only.

Daily budget, start at 25 dollars per day for a 7 day test.

Bid strategy, start with manual CPC or maximize clicks with a strict CPC cap until conversion data exists.

Conversion action, `qualified_lead`.

Do not optimize to raw `generate_lead` until spam filtered lead quality is reliable.

## Ad Groups

### Permit Load Study

Intent, people who need capacity documentation for permits or plan checks.

Match types, exact and phrase only.

Keywords:

1. `"electrical load study"`
2. `[electrical load study]`
3. `"electrical load calculation"`
4. `[electrical load calculation]`
5. `"load calculation permit"`
6. `"ladbs electrical load calculation"`
7. `"electrical capacity report"`

Landing page, `/electrical-load-studies/`.

### EV Charger Load Study

Intent, people planning EV chargers before they know whether the existing service can support them.

Keywords:

1. `"ev charger load study"`
2. `[ev charger load study]`
3. `"ev charger load calculation"`
4. `"ev charger electrical capacity"`
5. `"commercial ev charger load calculation"`
6. `"multifamily ev charger load study"`

Landing page, `/electrical-load-studies/`.

### Commercial Capacity Study

Intent, businesses, property managers, and tenant improvement teams checking capacity before equipment changes.

Keywords:

1. `"commercial electrical load study"`
2. `[commercial electrical load study]`
3. `"commercial electrical capacity study"`
4. `"tenant improvement electrical load calculation"`
5. `"building electrical capacity evaluation"`
6. `"electrical capacity for tenant loads"`

Landing page, `/electrical-load-studies/`.

### Panel Or Service Upgrade Study

Intent, people deciding whether a panel or service upgrade is needed.

Keywords:

1. `"panel upgrade load calculation"`
2. `"service upgrade load calculation"`
3. `"electrical service capacity study"`
4. `"do i need a panel upgrade for ev charger"`
5. `"electrical panel capacity calculation"`

Landing page, `/electrical-load-studies/`.

## Negative Keywords

Use phrase or exact negatives where appropriate.

1. jobs
2. hiring
3. career
4. salary
5. training
6. school
7. course
8. diy
9. template
10. spreadsheet
11. calculator
12. software
13. free
14. pdf
15. nec table
16. sample
17. definition
18. residential electrician jobs
19. electrical estimator
20. estimating service
21. seo
22. marketing
23. broker

## Responsive Search Ad Concepts

### Concept 1, Permit And Capacity

Headlines:

1. Los Angeles Electrical Load Study
2. Capacity Reports For Permit Work
3. Know If Your Service Can Handle It
4. EV Charger And Tenant Load Studies
5. Local Electrical Contractor
6. Plan Before Buying Equipment
7. LADBS Permit Capacity Support
8. Commercial Load Study Help
9. Get A Clear Capacity Answer
10. Shaffer Construction

Descriptions:

1. Need a load study before EV chargers, tenant improvements, or a panel upgrade? We check capacity and give practical next steps.
2. Los Angeles electrical contractor for capacity review, load study planning, and permit support.
3. Send property details, utility info, plans, or charger specs, we will tell you what is needed next.

### Concept 2, EV Charger Feasibility

Headlines:

1. EV Charger Load Study
2. Check Capacity Before Install
3. Commercial EV Charger Planning
4. Multifamily EV Capacity Review
5. Avoid Surprise Service Upgrades
6. Load Study For EV Permits
7. Los Angeles EV Electrical Help
8. Utility And Permit Planning
9. Capacity Study Before Bids
10. Shaffer Construction

Descriptions:

1. Planning EV chargers? Confirm electrical capacity before buying chargers or starting permit work.
2. We review existing service, expected loads, charger plans, and timing so the project starts with facts.
3. Built for commercial, multifamily, tenant improvement, and property management projects in Los Angeles.

### Concept 3, Tenant Improvement And Service Upgrade

Headlines:

1. Tenant Improvement Load Study
2. Electrical Capacity Evaluation
3. Panel Upgrade Decision Help
4. Service Upgrade Planning
5. Load Study For New Equipment
6. Los Angeles Electrical Reports
7. Know Before You Upgrade
8. Commercial Electrical Planning
9. Capacity Review For Permits
10. Shaffer Construction

Descriptions:

1. Adding equipment, changing tenant loads, or planning a service upgrade? Start with a load study.
2. We help property owners and project teams understand capacity, risks, and next electrical steps.
3. Use the intake form to send the property type, project reason, utility, deadline, and available plans.

## Stop Conditions

1. Pause if spend reaches 250 dollars with 0 `qualified_lead` events.
2. Pause if more than 50 percent of accepted leads are vendor spam, job seekers, or non service inquiries.
3. Pause any ad group with more than 50 clicks and 0 qualified form or call actions.
4. Pause any keyword with high spend and search terms showing DIY, jobs, training, software, or estimating vendor intent.
5. Do not expand to broad match until at least 10 qualified load study leads are recorded.

## Measurement Checklist

1. Confirm `qualified_lead` fires only for accepted potential customer submissions.
2. Confirm GitHub lead JSON includes `jobCategory`, `leadQuality`, `spamAssessment`, `sourcePage`, `landingPage`, and `loadStudyIntake`.
3. Confirm Google Ads conversion import or GA4 conversion link uses `qualified_lead`, not raw form submission.
4. Review search terms daily during the first week.
5. Add negatives immediately when spam or research intent appears.

## Decision

We do not have enough lead quality data for a confident paid campaign today. We do have enough Search Console signal and enough tracking infrastructure to prepare a very narrow draft. Launch only after the live intake path produces trustworthy `qualified_lead` evidence.
