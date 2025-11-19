# Evergreen Blog Posts - Detailed Writing Instructions

## Overview
This guide provides step-by-step instructions for writing 20 evergreen, SEO-optimized blog posts for Shaffer Construction. Unlike daily news posts, these are timeless guides that will rank for years.

**Company:** Shaffer Construction, Inc.
**Phone:** 323-642-8509
**Email:** hello@shaffercon.com
**Service Area:** Los Angeles, California

---

## PREPARATION STEP (Do This First!)

### Step 1: Fetch the Sitemap for Internal Linking

Run this command to get all service pages and blog posts you can link to:

```bash
curl -s "https://shaffercon.com/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g; s/<\/loc>//g' > /tmp/sitemap.txt
```

Review the sitemap to identify relevant pages to link to in your blog posts.

### Step 2: Review Existing Blog Posts for Style

List recent blog posts:
```bash
ls -lt /home/user/shaffercon/content/industry-insights/*.json | head -10
```

Read one to understand the writing style:
```bash
cat /home/user/shaffercon/content/industry-insights/[FILENAME].json | jq -r '.content'
```

---

## STANDARD STRUCTURE FOR ALL EVERGREEN POSTS

### Content Requirements
- **Length:** 1,800-2,500 words
- **Tone:** Professional, informative, authoritative but accessible
- **Format:** Simple HTML only (no CSS, no style attributes)
- **Internal Links:** 2-4 blog posts + 1-2 service pages (MANDATORY)
- **Local Focus:** Los Angeles-specific throughout

### HTML Structure Template
```html
<h2>Introduction</h2>
<p>[Opening paragraph mentioning Shaffer Construction and what readers will learn]</p>

<h2>[Main Section 1 Heading]</h2>
<p>[Content paragraph with details]</p>
<p>[Additional context and Los Angeles-specific information]</p>
<p>[Connection to Shaffer Construction's services]</p>

<h2>[Main Section 2 Heading]</h2>
<p>[Content paragraph]</p>
<p>[Include <a href="/service-areas/hollywood/residential-electrical-panel-upgrades">internal service page link</a> naturally in content]</p>

<h2>[Main Section 3 Heading]</h2>
<p>[Content paragraph]</p>

<h2>[Main Section 4 Heading]</h2>
<p>[Content paragraph]</p>
<p>[Include <a href="/industry-insights/previous-blog-slug">internal blog link</a> for additional context]</p>

<h2>[Main Section 5 Heading]</h2>
<p>[Content paragraph]</p>

<h2>Frequently Asked Questions</h2>
<p><strong>Question 1 here?</strong></p>
<p>Answer paragraph here.</p>
<p><strong>Question 2 here?</strong></p>
<p>Answer paragraph here.</p>

<h2>Conclusion</h2>
<p>[Summary of key points]</p>
<p>[Strong CTA] Contact Shaffer Construction at <strong>323-642-8509</strong> or email <a href="mailto:hello@shaffercon.com">hello@shaffercon.com</a> to schedule your [service]. Visit <a href="https://www.shaffercon.com">www.shaffercon.com</a> to learn more about our comprehensive electrical services throughout Los Angeles.</p>
```

### JSON File Template
```json
{
  "title": "Your SEO-Optimized Title",
  "slug": "your-url-slug",
  "date": "2025-11-19T10:00:00",
  "metaTitle": "Your Title | Shaffer Construction",
  "metaDescription": "Your 150-160 character meta description with keywords",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your HTML content here...</p>"
}
```

---

## POST #1: Complete Guide to Electrical Panel Upgrades in Los Angeles Homes

### Research Instructions
Search for the following topics:
1. "electrical panel upgrade cost 2024"
2. "100 amp vs 200 amp electrical panel"
3. "when to upgrade electrical panel"
4. "Los Angeles electrical permit requirements"
5. "LADWP electrical service upgrade"

### What to Write About

**Section 1: Introduction**
- What an electrical panel upgrade is
- Why Los Angeles homeowners need this guide
- Preview of what readers will learn
- Mention Shaffer Construction's expertise

**Section 2: What is an Electrical Panel Upgrade?**
- Explain the electrical panel (breaker box)
- Role in home electrical system
- Components: main breaker, branch circuits, grounding
- Common panel sizes: 100A, 150A, 200A, 400A

**Section 3: Signs Your Los Angeles Home Needs a Panel Upgrade**
- Frequent circuit breaker trips
- Flickering or dimming lights
- Burning smell or discoloration around panel
- Panel is warm to the touch
- Adding major appliances (EV charger, pool, AC)
- Home is over 25 years old
- Aluminum wiring or fuses instead of breakers
- Planning a major renovation

**Section 4: 100 Amp vs 200 Amp Panel: Which Do You Need?**
- Modern homes typically need 200A minimum
- 100A panels common in older LA homes (pre-1980s)
- Calculate your home's electrical load
- Future-proofing for EVs, solar, hot tubs
- When 400A service makes sense

**Section 5: The Panel Upgrade Process in Los Angeles**
- Step 1: Professional assessment and load calculation
- Step 2: Design and permit application with LA Department of Building and Safety
- Step 3: Coordination with LADWP for service upgrade
- Step 4: Installation (typically 1-2 days)
- Step 5: Inspection and approval
- Mention Shaffer Construction handles entire process

**Section 6: Permits and Los Angeles Building Code Requirements**
- All panel upgrades require permits
- LA building code compliance (based on NEC)
- AFCI and GFCI requirements for new installations
- Working with inspectors
- Risks of unpermitted work

**Section 7: Cost of Electrical Panel Upgrade in Los Angeles**
- Typical cost range: $2,500-$6,000+ depending on scope
- Factors affecting cost: panel size, service entrance upgrades, LADWP coordination, accessibility
- Additional costs: trenching, meter relocation, main line upgrades
- Long-term value and safety benefits
- Insurance premium reduction potential

**Section 8: LADWP Coordination and Service Upgrades**
- When LADWP service line upgrade is needed
- Requesting service increase from LADWP
- Coordination timeline (can take 2-4 weeks)
- Underground vs overhead service considerations
- No cost for first service upgrade in most cases

**Section 9: Frequently Asked Questions**
Include 5-7 FAQ in this format:
- How long does a panel upgrade take?
- Do I need to leave my home during the upgrade?
- Will my power be off during installation?
- Can I upgrade my panel myself?
- What happens if I don't upgrade an outdated panel?
- Will a panel upgrade increase my home's value?

**Section 10: Conclusion**
- Recap importance of modern, safe electrical panel
- Summary of when to upgrade
- Strong CTA to call Shaffer Construction

### Internal Linking Strategy
**Service Pages to Link (1-2):**
- `/service-areas/[location]/residential-electrical-panel-upgrades`
- `/service-areas/[location]/residential-electrical-safety-inspections`
- `/residential-ev-charger` (mention EV chargers need panel capacity)

**Blog Posts to Link (2-4):**
- Look for posts about:
  - AFCI/GFCI requirements
  - Old electrical panels (Federal Pacific, Zinsco)
  - EV charger installation requirements
  - Home electrical safety

### SEO Keywords to Include Naturally
- electrical panel upgrade Los Angeles
- breaker box replacement
- 200 amp panel upgrade
- Los Angeles electrical contractor
- LADWP service upgrade
- electrical panel cost
- licensed electrician Los Angeles

### JSON Filename
`2025-11-19T10:00:00-complete-guide-electrical-panel-upgrades-los-angeles.json`

### JSON Content
```json
{
  "title": "Complete Guide to Electrical Panel Upgrades in Los Angeles Homes",
  "slug": "complete-guide-electrical-panel-upgrades-los-angeles",
  "date": "2025-11-19T10:00:00",
  "metaTitle": "Electrical Panel Upgrade Guide Los Angeles | Shaffer Construction",
  "metaDescription": "Complete guide to electrical panel upgrades for LA homeowners. Learn costs, permit requirements, when to upgrade, and LADWP coordination. Expert installation by Shaffer Construction.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POST #2: How to Know If Your Home Needs an Electrical Panel Upgrade

### Research Instructions
Search for:
1. "signs of electrical panel problems"
2. "circuit breaker keeps tripping"
3. "flickering lights electrical problem"
4. "burning smell electrical panel"
5. "Federal Pacific panel replacement"

### What to Write About

**Section 1: Introduction**
- Electrical panel as the heart of home electrical system
- Many Los Angeles homes have outdated panels
- This guide helps homeowners identify warning signs
- Shaffer Construction's expertise in panel assessments

**Section 2: Warning Sign #1 - Frequent Circuit Breaker Trips**
- What it means when breakers trip often
- Normal vs abnormal tripping
- Circuit overload vs faulty breaker
- Why modern homes need more circuits
- Los Angeles homes with original 1950s-1970s panels especially susceptible

**Section 3: Warning Sign #2 - Flickering or Dimming Lights**
- When lights dim when appliances start
- Indicates insufficient electrical capacity
- Difference between loose connection and undersized panel
- Particularly noticeable with AC units in LA summers
- Professional diagnosis needed

**Section 4: Warning Sign #3 - Burning Smell or Scorch Marks**
- IMMEDIATE safety concern - emergency sign
- Indicates overheating connections or breakers
- Can lead to electrical fire
- Never ignore these signs
- Call electrician immediately (mention 24/7 availability)

**Section 5: Warning Sign #4 - Panel is Warm to the Touch**
- Panels should not be hot or warm
- Indicates dangerous overloading
- Breaker failure or loose connections
- Common in older LA homes during summer
- Requires immediate professional inspection

**Section 6: Warning Sign #5 - Visible Rust or Corrosion**
- Moisture damage to electrical panels
- Common in LA homes near ocean (salt air corrosion)
- Garages and outdoor panels especially vulnerable
- Corroded connections create fire hazard
- Require panel replacement, not just repair

**Section 7: Warning Sign #6 - Planning to Add Major Appliances**
- EV chargers (Level 2 requires 40-50 amps)
- Central air conditioning
- Pool equipment
- Hot tub or spa
- Solar panel system
- Load calculation determines if upgrade needed

**Section 8: Warning Sign #7 - Home Age and Obsolete Panels**
- Homes built before 1990 often need upgrades
- Federal Pacific Electric (FPE) panels - fire hazard
- Zinsco panels - known failure issues
- Fuse boxes (pre-1960s) - should be replaced
- Aluminum bus bars (less common but problematic)

**Section 9: Warning Sign #8 - Insurance or Sale Issues**
- Insurance companies may deny coverage for FPE/Zinsco panels
- Home inspection failures during sale
- Lenders requiring upgrades before financing
- Peace of mind for buyers/sellers

**Section 10: What to Do If You See These Signs**
- Don't ignore warning signs
- Schedule professional electrical inspection
- Shaffer Construction offers comprehensive inspections
- Load study to determine capacity needs
- Get written assessment and upgrade proposal

**Section 11: Frequently Asked Questions**
- Can I inspect my own electrical panel?
- How often should panels be inspected?
- Is it safe to use my electricity if I see these signs?
- How quickly do I need to act?
- What does an electrical inspection cost?

**Section 12: Conclusion**
- Safety is paramount
- Early detection prevents fires and damage
- Professional inspection provides peace of mind
- Strong CTA to schedule inspection with Shaffer Construction

### Internal Linking Strategy
**Service Pages (1-2):**
- `/service-areas/[location]/residential-electrical-safety-inspections`
- `/service-areas/[location]/residential-electrical-panel-upgrades`

**Blog Posts (2-4):**
- Link to Post #1 (Panel Upgrade Guide)
- Link to Post #3 (Federal Pacific/Zinsco panels) when mentioning them
- Link to any existing posts about electrical safety
- Link to EV charger posts when mentioning major appliance loads

### SEO Keywords to Include
- electrical panel problems
- signs need panel upgrade
- circuit breaker tripping
- flickering lights electrical
- Los Angeles electrician
- electrical safety inspection
- Federal Pacific panel

### JSON Filename
`2025-11-19T11:00:00-how-to-know-home-needs-electrical-panel-upgrade.json`

### JSON Content
```json
{
  "title": "How to Know If Your Home Needs an Electrical Panel Upgrade",
  "slug": "how-to-know-home-needs-electrical-panel-upgrade",
  "date": "2025-11-19T11:00:00",
  "metaTitle": "Signs You Need an Electrical Panel Upgrade | Shaffer Construction",
  "metaDescription": "Learn the 8 warning signs your Los Angeles home needs an electrical panel upgrade. From flickering lights to Federal Pacific panels, know when to call an electrician.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POST #3: Federal Pacific and Zinsco Panels: Why LA Homeowners Should Replace Them

### Research Instructions
Search for:
1. "Federal Pacific panel fire hazard"
2. "Zinsco panel problems"
3. "FPE Stab-Lok recall"
4. "obsolete electrical panels insurance"
5. "Federal Pacific panel replacement cost"

### What to Write About

**Section 1: Introduction**
- Thousands of LA homes still have FPE and Zinsco panels
- Both brands have documented safety failures
- This guide explains the risks and replacement process
- Shaffer Construction has replaced hundreds of these panels

**Section 2: What Are Federal Pacific Electric (FPE) Panels?**
- Manufactured 1950s-1980s
- Installed in millions of homes nationwide
- Stab-Lok breakers
- Common in LA homes built 1960s-1970s
- Recognizable by red/black breaker switches
- Company went bankrupt in 1980s

**Section 3: The Federal Pacific Panel Problem**
- Breakers fail to trip during overload (28% failure rate in studies)
- Can allow circuits to overheat without protection
- Documented fire hazard
- CPSC investigation found defects
- Breakers can appear "off" but still be energized
- Bus bar connection failures

**Section 4: What Are Zinsco Panels?**
- Manufactured 1950s-1970s
- Later sold to Sylvania, then GTE
- Also called Magnetrip or Sylvania panels
- Aluminum bus bars prone to corrosion
- Common in LA homes from 1960s-1970s

**Section 5: The Zinsco Panel Problem**
- Breakers fuse to aluminum bus bars
- Breakers won't trip even when switched off
- Aluminum oxidation creates high resistance
- Overheating and fire risk
- Cannot be properly repaired - must replace

**Section 6: Insurance and Liability Issues**
- Many insurers refuse coverage with FPE/Zinsco panels
- Higher premiums if they do insure
- Disclosure requirements when selling home
- Inspection failures during home sales
- Liability if fire occurs and panel is known issue
- Some lenders won't finance homes with these panels

**Section 7: Home Sale Implications**
- Buyers negotiate price reduction for panel replacement
- Home inspection always flags these panels
- Can derail sales if not addressed
- Replacing before listing increases marketability
- Returns investment in sale price/speed

**Section 8: Identifying FPE and Zinsco Panels in Your Home**
**Federal Pacific:**
- Look for "FPE" or "Federal Pacific" label
- Stab-Lok breaker brand name
- Breakers with red/black toggles
- Typical locations: garage, basement, exterior

**Zinsco:**
- Look for "Zinsco," "Magnetrip," or "Sylvania" label
- Colorful breaker switches
- Often mounted in garage or exterior
- Aluminum bus bars visible inside

**Section 9: The Replacement Process**
- Professional electrical inspection first
- Modern panel selection (200A minimum recommended)
- Permit application with LA Department of Building and Safety
- LADWP coordination if service upgrade needed
- Installation typically 1-2 days
- Final inspection and approval
- Documentation for insurance/future sale

**Section 10: Cost to Replace FPE or Zinsco Panels**
- Panel replacement: $2,500-$5,000+
- Service upgrade adds cost if needed
- Factors: accessibility, main service size, permit fees
- Small price for safety and peace of mind
- May qualify for insurance discount
- Compare to cost of fire damage or insurance denial

**Section 11: Why You Shouldn't Wait**
- These panels are 40-70 years old
- Fire risk increases with age
- Insurance coverage at risk
- Home sale complications
- No warning before failure
- Protecting your family and investment

**Section 12: Frequently Asked Questions**
- Can I just replace the breakers instead of the whole panel?
- Are all FPE/Zinsco panels dangerous?
- Will insurance pay for replacement?
- How long does replacement take?
- Can I sell my home without replacing the panel?
- What if I can't afford to replace it right now?

**Section 13: Conclusion**
- Clear safety imperative to replace
- Professional assessment available from Shaffer Construction
- Don't wait for insurance denial or failed home inspection
- Strong CTA with phone number

### Internal Linking Strategy
**Service Pages (1-2):**
- `/service-areas/[location]/residential-electrical-panel-upgrades`
- `/service-areas/[location]/residential-electrical-safety-inspections`

**Blog Posts (2-4):**
- Link to Post #1 (Panel Upgrade Guide) for replacement process details
- Link to Post #2 (Warning Signs) when discussing panel problems
- Link to any posts about home electrical safety
- Link to posts about Los Angeles building codes/permits

### SEO Keywords
- Federal Pacific panel replacement
- Zinsco panel dangerous
- FPE Stab-Lok fire hazard
- obsolete electrical panels Los Angeles
- electrical panel replacement cost
- Los Angeles electrical contractor
- home insurance electrical panel

### JSON Filename
`2025-11-19T12:00:00-federal-pacific-zinsco-panels-replacement-los-angeles.json`

### JSON Content
```json
{
  "title": "Federal Pacific and Zinsco Panels: Why Los Angeles Homeowners Should Replace Them Immediately",
  "slug": "federal-pacific-zinsco-panels-replacement-los-angeles",
  "date": "2025-11-19T12:00:00",
  "metaTitle": "FPE & Zinsco Panel Replacement Los Angeles | Shaffer Construction",
  "metaDescription": "Federal Pacific and Zinsco electrical panels are fire hazards found in thousands of LA homes. Learn why replacement is critical and how Shaffer Construction can help.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POST #4: Understanding California Title 24 Electrical Requirements for Home Renovations

### Research Instructions
Search for:
1. "California Title 24 electrical requirements 2024"
2. "Los Angeles building permit electrical"
3. "AFCI requirements California"
4. "GFCI code requirements 2024"
5. "California energy code electrical"

### What to Write About

**Section 1: Introduction**
- California Title 24 overview
- Applies to all residential renovations in LA
- Ensures safety and energy efficiency
- Shaffer Construction expertise in code compliance

**Section 2: What is California Title 24?**
- Part of California Building Standards Code
- Two main parts: Building Energy Efficiency Standards (Part 6) and Electrical Code (Part 3)
- Based on National Electrical Code (NEC) with California amendments
- Updated every 3 years
- Current version effective January 2023
- Why California has stricter requirements than federal code

**Section 3: When Title 24 Applies to Your Renovation**
- Any electrical work requiring a permit
- Adding new circuits
- Panel upgrades or replacements
- Room additions
- Kitchen and bathroom remodels
- Garage conversions
- ADU construction
- EV charger installation
- Pool/spa electrical

**Section 4: AFCI (Arc Fault Circuit Interrupter) Requirements**
- What AFCIs do - prevent electrical fires from arcing
- Required in all habitable rooms: bedrooms, living rooms, dining rooms, family rooms, dens, libraries, closets, hallways
- Must be installed for new circuits and panel replacements
- Combination-type AFCI required
- Cost implications ($40-60 per AFCI breaker vs $5-10 standard)
- Not required for bathrooms, garages, exterior, kitchen appliances

**Section 5: GFCI (Ground Fault Circuit Interrupter) Requirements**
- What GFCIs do - prevent electrocution from ground faults
- Required locations:
  - All kitchen countertop receptacles
  - All bathroom receptacles
  - Garage and accessory buildings
  - Outdoor receptacles
  - Crawl spaces and unfinished basements
  - Wet bar sinks
  - Laundry areas
  - Within 6 feet of sinks, tubs, showers
- GFCI breakers vs GFCI receptacles
- Testing requirements

**Section 6: Dedicated Circuit Requirements**
- What dedicated circuits are
- Required for:
  - Refrigerator
  - Dishwasher
  - Garbage disposal
  - Microwave (if built-in)
  - Each bathroom
  - Laundry
  - Electric range/oven
  - Central AC
  - EV charger
  - Pool/spa equipment
- Wire sizing requirements for each

**Section 7: Lighting and Switching Requirements**
- Minimum lighting requirements per room
- Energy efficiency requirements (LED/CFL in most fixtures)
- Three-way switches for staircases
- Tamper-resistant receptacles (required in all areas accessible to children)
- Spacing requirements for receptacles (12 feet maximum)

**Section 8: Los Angeles Permit Process**
- When permits are required (all electrical work except minor repairs)
- LA Department of Building and Safety (LADBS)
- Online vs in-person permit application
- Required documentation: plans, load calculations, contractor license
- Permit fees (based on project valuation)
- Inspection requirements
- Typical timeline: 2-4 weeks from application to approval

**Section 9: Working with Inspectors**
- What inspectors look for
- Rough inspection (before closing walls)
- Final inspection (after completion)
- Common inspection failures and how to avoid them
- Corrections process if work doesn't pass
- Importance of hiring licensed contractor

**Section 10: Penalties for Non-Compliance**
- Fines from LADBS
- Work stoppage orders
- Requirement to tear out unpermitted work
- Insurance claim denials
- Disclosure requirements when selling
- Difficulty selling home with unpermitted work
- Liability for future owners

**Section 11: DIY vs Professional Installation**
- California requires licensed electrician for most work
- Homeowner can pull own permits but must do work themselves
- Risks of DIY electrical work
- Value of hiring licensed, insured contractor
- Shaffer Construction ensures all code compliance

**Section 12: Energy Efficiency Beyond Code Minimums**
- Title 24 sets minimum standards
- Opportunities to exceed: LED throughout, smart controls, solar-ready panel
- LADWP rebates for efficiency upgrades
- Long-term energy savings

**Section 13: Frequently Asked Questions**
- Do I need a permit to replace outlets or switches?
- Can I do my own electrical work in California?
- How much do electrical permits cost in Los Angeles?
- What happens if I skip the permit?
- How long does electrical inspection take?
- Can inspectors make me upgrade things not part of my project?

**Section 14: Conclusion**
- Title 24 protects safety and ensures quality
- Proper permitting protects home value
- Professional contractor handles all compliance
- Strong CTA to Shaffer Construction

### Internal Linking Strategy
**Service Pages (1-2):**
- `/service-areas/[location]/residential-electrical-panel-upgrades`
- `/service-areas/[location]/residential-electrical-safety-inspections`
- `/residential-ev-charger` (when discussing EV charger code requirements)

**Blog Posts (2-4):**
- Link to Post #1 (Panel Upgrades) when discussing panel requirements
- Link to Post #5 (AFCI vs GFCI) for deeper dive on those topics
- Link to any posts about kitchen/bathroom electrical
- Link to ADU or home renovation posts if they exist

### SEO Keywords
- California Title 24 electrical
- Los Angeles building code electrical
- AFCI requirements California
- GFCI code requirements
- electrical permit Los Angeles
- licensed electrician Los Angeles
- LADBS electrical permit

### JSON Filename
`2025-11-19T13:00:00-california-title-24-electrical-requirements-renovations.json`

### JSON Content
```json
{
  "title": "Understanding California Title 24 Electrical Requirements for Home Renovations",
  "slug": "california-title-24-electrical-requirements-renovations",
  "date": "2025-11-19T13:00:00",
  "metaTitle": "California Title 24 Electrical Code Guide | Shaffer Construction",
  "metaDescription": "Complete guide to California Title 24 electrical requirements for LA home renovations. Learn AFCI, GFCI, permit requirements and code compliance from licensed electricians.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POST #5: AFCI vs GFCI: What LA Homeowners Need to Know About Circuit Protection

### Research Instructions
Search for:
1. "AFCI vs GFCI difference"
2. "arc fault circuit breaker how it works"
3. "ground fault protection explained"
4. "where AFCI required"
5. "GFCI requirements bathroom kitchen"

### What to Write About

**Section 1: Introduction**
- Circuit protection beyond standard breakers
- AFCI and GFCI save lives and prevent fires
- California code requires both in different areas
- This guide explains what they are, where required, and why
- Shaffer Construction ensures proper protection in all installations

**Section 2: Understanding Standard Circuit Breakers**
- What standard breakers do: protect against overload and short circuits
- Thermal-magnetic operation
- Why they're not enough for all hazards
- Led to development of AFCI and GFCI
- Standard breakers still used in some applications

**Section 3: What is a GFCI (Ground Fault Circuit Interrupter)?**
- Protects against electrocution from ground faults
- Detects imbalance between hot and neutral current
- Trips in 1/40th of a second
- Invented in 1960s, widely required since 1970s
- Two types: GFCI receptacles and GFCI breakers
- How they work: monitors current flow, detects leakage to ground

**Section 4: Where GFCIs Are Required**
- California code requirements (comprehensive list):
  - All bathroom receptacles
  - Kitchen countertop receptacles (within 6 feet of sink)
  - Outdoor receptacles
  - Garage receptacles
  - Unfinished basements and crawl spaces
  - Wet bar areas
  - Laundry areas
  - Within 6 feet of any sink
  - Pool, spa, and hot tub areas
- Common in LA homes: outdoor living spaces, garage workshops

**Section 5: GFCI Receptacles vs GFCI Breakers**
**GFCI Receptacles:**
- Installed at outlet location
- Recognizable by test/reset buttons
- Can protect downstream outlets if wired correctly
- Cost: $15-30 per receptacle
- Easier to reset when tripped

**GFCI Breakers:**
- Installed in electrical panel
- Protects entire circuit
- Better for hard-wired appliances
- Cost: $40-60 per breaker
- Takes up two slots in panel
- Better for multiple outlets on same circuit

**Section 6: What is an AFCI (Arc Fault Circuit Interrupter)?**
- Protects against electrical fires from arcing
- Newer technology (required since 1999, expanded since)
- Detects dangerous arcing conditions
- Different from normal arcing (like switch operation)
- Critical for preventing electrical fires in living spaces
- How they work: advanced electronics detect arc signatures

**Section 7: Where AFCIs Are Required**
- California code requirements:
  - All bedrooms (since 1999)
  - Family rooms (since 2008)
  - Dining rooms (since 2008)
  - Living rooms (since 2008)
  - Parlors, libraries, dens, sunrooms (since 2008)
  - Closets (since 2008)
  - Hallways (since 2008)
  - Similar spaces
- Essentially all habitable rooms except bathrooms and kitchens
- Required when adding circuits or replacing panels

**Section 8: Combination AFCI Requirements**
- Modern code requires "combination-type" AFCI
- Protects against both series and parallel arcs
- More comprehensive than original branch/feeder AFCI
- All new AFCI breakers are combination-type
- Cannot use old-style AFCI breakers for new work

**Section 9: Rooms Requiring Both AFCI and GFCI**
- Laundry rooms often require both
- Bedroom with sink needs both
- Code-compliant solutions:
  - Dual-function AFCI/GFCI breaker ($70-90)
  - AFCI breaker + GFCI receptacle ($50-70 combined)
- Shaffer Construction determines most cost-effective approach

**Section 10: Common AFCI/GFCI Issues and Solutions**
**Nuisance Tripping:**
- AFCIs sensitive to some electronic loads
- LED lights, vacuum cleaners, treadmills can cause trips
- Usually indicates real issue, not false alarm
- May need dedicated circuit for problematic appliance

**GFCI Tripping:**
- Moisture is common cause
- Worn appliances with ground leakage
- Shared neutral circuits (older homes)
- Proper diagnosis needed

**Testing:**
- Test monthly using test button
- Both types have test and reset buttons
- If won't reset, indicates problem or failed device

**Section 11: Retrofit Requirements**
- Not required to retrofit entire home immediately
- Required when:
  - Adding new circuits
  - Replacing panel
  - Renovating rooms
  - Altering existing circuits
- Good idea to upgrade even if not required
- Especially important in older LA homes

**Section 12: Cost Considerations**
**GFCI Costs:**
- Receptacle: $15-30
- Breaker: $40-60
- Installation labor: $75-150 per device

**AFCI Costs:**
- Breaker: $40-60
- Dual-function AFCI/GFCI: $70-90
- Installation: included in circuit/panel work

**Long-term Value:**
- Fire and electrocution prevention
- Insurance benefits
- Home sale advantages
- Code compliance

**Section 13: Special Considerations for Los Angeles Homes**
- Outdoor living spaces common in LA - need GFCI protection
- Pool/spa culture - comprehensive GFCI critical
- Older homes (pre-1990) likely lack proper protection
- Garage workshops popular - need both AFCI and GFCI
- Earthquake considerations - GFCIs help prevent shock from damaged wiring

**Section 14: Professional Installation**
- Licensed electrician required in California
- Proper installation critical for function
- Load calculations for circuit compatibility
- Panel space considerations
- Shaffer Construction ensures code-compliant installation

**Section 15: Frequently Asked Questions**
- Why does my GFCI keep tripping?
- Can I install GFCI/AFCI myself?
- Do I need to replace all my outlets?
- What's the difference between GFCI breaker and outlet?
- Are AFCI breakers really necessary?
- How do I know if my home has AFCI/GFCI protection?
- Can AFCI/GFCI be installed in old panels?

**Section 16: Conclusion**
- Both AFCI and GFCI are essential safety devices
- Required by code for good reason
- Small investment for significant safety benefit
- Professional installation ensures proper protection
- Strong CTA to Shaffer Construction for assessment

### Internal Linking Strategy
**Service Pages (1-2):**
- `/service-areas/[location]/residential-electrical-safety-inspections`
- `/service-areas/[location]/residential-electrical-panel-upgrades`

**Blog Posts (2-4):**
- Link to Post #4 (Title 24) when discussing code requirements
- Link to Post #1 (Panel Upgrades) when mentioning panel replacement
- Link to Post #2 (Warning Signs) when discussing electrical safety
- Link to any posts about kitchen/bathroom electrical, pools, outdoor living

### SEO Keywords
- AFCI vs GFCI
- arc fault circuit breaker
- ground fault protection
- electrical safety Los Angeles
- AFCI requirements California
- GFCI code requirements
- circuit breaker types
- licensed electrician Los Angeles

### JSON Filename
`2025-11-19T14:00:00-afci-vs-gfci-circuit-protection-los-angeles.json`

### JSON Content
```json
{
  "title": "AFCI vs GFCI: What Los Angeles Homeowners Need to Know About Circuit Protection",
  "slug": "afci-vs-gfci-circuit-protection-los-angeles",
  "date": "2025-11-19T14:00:00",
  "metaTitle": "AFCI vs GFCI Explained Los Angeles | Shaffer Construction",
  "metaDescription": "Learn the difference between AFCI and GFCI protection, where each is required in LA homes, and why both are essential for electrical safety. Expert installation by Shaffer Construction.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POST #6: Ultimate Guide to Home EV Charger Installation in Los Angeles

### Research Instructions
Search for:
1. "home EV charger installation cost 2024"
2. "Level 2 EV charger vs Level 1"
3. "EV charger electrical requirements"
4. "Los Angeles EV charger rebates"
5. "Tesla Wall Connector installation"

### What to Write About

**Section 1: Introduction**
- EV adoption exploding in Los Angeles
- Home charging is essential for EV ownership convenience
- This comprehensive guide covers everything LA homeowners need to know
- Shaffer Construction has installed hundreds of home EV chargers

**Section 2: Why Home EV Charging Matters**
- 80% of EV charging happens at home
- Overnight charging convenience
- Lower cost than public charging
- Time savings vs driving to public chargers
- Reliability and availability
- Increasing home value

**Section 3: Level 1 vs Level 2 Charging**
**Level 1 (120V):**
- Uses standard household outlet
- 3-5 miles of range per hour
- Adequate for plug-in hybrids
- Insufficient for most full EVs
- No installation required
- Free with vehicle purchase

**Level 2 (240V):**
- Dedicated 240V circuit (like dryer or oven)
- 25-50 miles of range per hour
- Essential for most EV owners
- Requires professional installation
- $500-2,500 installed
- Multiple brands and options

**Why Level 2 is Recommended:**
- Full overnight charge for most EVs
- Future-proofs for larger battery packs
- Better for daily driving needs
- Required for multiple EVs in household

**Section 4: Electrical Requirements for Level 2 Chargers**
- 240V dedicated circuit
- Typical amperage: 32A, 40A, or 48A continuous
- Circuit breaker sizing: 40A, 50A, or 60A
- Wire gauge: 8 AWG (40A), 6 AWG (50A), 4 AWG (60A)
- GFCI protection required
- Distance from panel to charger location affects cost

**Section 5: Assessing Your Home's Electrical Capacity**
- Electrical panel capacity check
- Older LA homes often have 100A service
- Most need 200A service for EV charger plus home loads
- Load calculation process
- When panel upgrade is needed (see link to Post #1 or #8)
- Shaffer Construction provides free load assessment

**Section 6: Choosing the Right EV Charger**
**Hardwired vs Plug-In:**
- Hardwired: permanent, sleeker, less expensive
- Plug-in (NEMA 14-50 or 6-50): portable, flexibility, easier to relocate

**Amperage Selection:**
- 32A (7.7 kW): most common, works for most EVs
- 40A (9.6 kW): faster charging
- 48A (11.5 kW): maximum for most vehicles

**Smart Features:**
- WiFi connectivity and app control
- Scheduling for off-peak rates
- Energy monitoring
- Integration with solar
- Load sharing for multiple chargers

**Popular Brands:**
- Tesla Wall Connector (Tesla owners)
- ChargePoint Home Flex (universal, smart features)
- JuiceBox (budget-friendly, smart)
- Grizzl-E (durable, outdoor rated)
- Emporia (energy monitoring)

**Section 7: Indoor vs Outdoor Installation**
- Most LA homes install in garage
- Outdoor installation common for:
  - Carports
  - Driveway parking
  - Homes without garages
- Outdoor considerations:
  - Weather-rated charger (NEMA 3R or 4)
  - Conduit protection required
  - Direct sunlight placement
  - Security/theft prevention

**Section 8: Los Angeles Permit Requirements**
- All EV charger installations require permit from LADBS
- Electrical permit application
- Contractor pulls permit (included in professional installation)
- Plans and load calculation required
- Inspection after installation
- Typical permit fee: $200-400
- Approval timeline: 1-2 weeks

**Section 9: Installation Process Step-by-Step**
**Step 1:** Electrical assessment and load calculation
**Step 2:** Charger selection and purchase
**Step 3:** Permit application
**Step 4:** Electrical panel circuit installation
**Step 5:** Wiring from panel to charger location
**Step 6:** Charger mounting and connection
**Step 7:** Testing and commissioning
**Step 8:** Final inspection
**Step 9:** Activation and homeowner training

Timeline: 2-4 weeks from assessment to completion

**Section 10: Installation Costs in Los Angeles**
**Cost Components:**
- Charger hardware: $400-$900
- Installation labor: $500-1,500
- Permit fees: $200-400
- Panel upgrade (if needed): $2,500-5,000+
- Total typical range: $1,200-$3,000 (if no panel upgrade needed)

**Factors Affecting Cost:**
- Distance from panel to charger
- Panel capacity/upgrade needs
- Indoor vs outdoor
- Accessibility and mounting surface
- Conduit requirements
- Number of chargers

**Section 11: Rebates and Incentives for LA Homeowners**
**LADWP Rebates:**
- Residential EV charger rebate programs (check current availability)
- Time-of-Use rate discounts
- Demand response programs

**Federal Tax Credit:**
- 30% tax credit up to $1,000 for installation costs (Alternative Fuel Vehicle Refueling Property Credit)
- Applies to hardware and installation labor
- Eligibility requirements

**State and Utility Programs:**
- California Clean Fuel Reward
- Self-Generation Incentive Program (if paired with battery storage)
- Local air quality district incentives

**Section 12: LADWP Considerations**
- Time-of-Use (TOU) rates for EV charging
- Off-peak charging 9pm-9am saves money
- Smart chargers can optimize for lowest rates
- Separate EV meter option (less common)
- Notify LADWP of EV charger installation (optional but beneficial)

**Section 13: Future-Proofing Your Installation**
- Install highest amperage your panel can support
- Consider two chargers if planning second EV
- Conduit for future solar or battery storage
- Smart charger for future utility programs
- Load management systems for multiple EVs

**Section 14: Common Mistakes to Avoid**
- Undersizing the circuit
- DIY installation without permit (illegal and dangerous)
- Not checking panel capacity first
- Choosing charger incompatible with vehicle
- Forgetting outdoor weather rating
- Not planning for future needs

**Section 15: Maintenance and Safety**
- EV chargers require minimal maintenance
- Periodic visual inspection for damage
- Test GFCI monthly
- Software updates for smart chargers
- Professional inspection every 3-5 years
- Keep charger clean and dry

**Section 16: Frequently Asked Questions**
- How long does it take to charge my EV at home?
- Can I install an EV charger myself?
- Do I need a panel upgrade?
- What if I have solar panels?
- Can I use my dryer outlet for EV charging?
- What happens if I move or sell my home?
- Can I charge in the rain?
- Do all EVs work with all chargers?

**Section 17: Conclusion**
- Home EV charging is essential for ownership experience
- Professional installation ensures safety and code compliance
- Rebates make installation more affordable
- Shaffer Construction handles entire process
- Strong CTA with phone number

### Internal Linking Strategy
**Service Pages (1-2):**
- `/residential-ev-charger`
- `/service-areas/[location]/residential-ev-charger-installation`
- `/electrical-load-studies` (when discussing capacity assessment)

**Blog Posts (2-4):**
- Link to Post #1 or #8 (Panel Upgrades) when discussing electrical capacity
- Link to Post #4 (Title 24) when discussing permits
- Link to any existing EV charging news posts
- Link to Post #10 (Load Studies) if discussing capacity assessment

### SEO Keywords
- home EV charger installation Los Angeles
- Level 2 charger cost
- residential EV charging
- Tesla Wall Connector installation
- EV charger electrician Los Angeles
- LADWP EV rebates
- panel upgrade for EV charger

### JSON Filename
`2025-11-19T15:00:00-ultimate-guide-home-ev-charger-installation-los-angeles.json`

### JSON Content
```json
{
  "title": "Ultimate Guide to Home EV Charger Installation in Los Angeles",
  "slug": "ultimate-guide-home-ev-charger-installation-los-angeles",
  "date": "2025-11-19T15:00:00",
  "metaTitle": "Home EV Charger Installation Guide LA | Shaffer Construction",
  "metaDescription": "Complete guide to home EV charger installation in Los Angeles. Learn about Level 2 charging, costs, permits, rebates, and electrical requirements. Expert installation by Shaffer Construction.",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content here...</p>"
}
```

---

## POSTS #7-20: Brief Instructions

Due to length, here are condensed instructions for the remaining posts. Follow the same detailed structure as Posts #1-6.

---

## POST #7: How to Choose the Right EV Charger for Your Los Angeles Home

**Research:** EV charger comparison, smart charger features, hardwired vs plug-in, amperage selection
**Key Topics:** Brand comparison (Tesla, ChargePoint, JuiceBox, Grizzl-E), smart features, amperage needs, hardwired vs plug-in, WiFi connectivity, cost comparison
**Internal Links:** Link to Post #6 (Installation Guide), residential EV charger service pages
**Keywords:** best home EV charger, Tesla charger vs universal, smart EV charger
**Filename:** `2025-11-20T10:00:00-how-to-choose-right-ev-charger-los-angeles.json`

---

## POST #8: Do I Need a Panel Upgrade to Install an EV Charger?

**Research:** Electrical load calculation, panel capacity, when upgrades needed, EV charger amperage
**Key Topics:** 100A vs 200A panels, load calculations, signs you need upgrade, costs, avoiding upgrades with load management
**Internal Links:** Link to Post #1 (Panel Upgrade Guide), Post #6 (EV Installation), load study service
**Keywords:** EV charger panel upgrade, 200 amp service for EV, electrical capacity for EV
**Filename:** `2025-11-20T11:00:00-do-i-need-panel-upgrade-install-ev-charger.json`

---

## POST #9: Commercial EV Charging Stations - ROI Guide for LA Business Owners

**Research:** Commercial EV charging ROI, workplace charging benefits, rebates for businesses, installation costs
**Key Topics:** Employee attraction/retention, customer amenity, revenue generation, tax incentives, LADWP commercial rebates, installation costs, best chargers for business
**Internal Links:** Commercial EV charger service, load study service, LED retrofit (energy efficiency angle)
**Keywords:** commercial EV charging station ROI, business EV charger installation, workplace charging
**Filename:** `2025-11-20T12:00:00-commercial-ev-charging-stations-roi-guide-los-angeles.json`

---

## POST #10: Electrical Load Studies - What They Are and When Your LA Business Needs One

**Research:** Electrical load study process, when required, commercial electrical capacity, utility coordination
**Key Topics:** What load studies measure, when required by LADWP, process and timeline, costs, planning for expansion, tenant improvements
**Internal Links:** Load study service page, commercial EV chargers, panel upgrades
**Keywords:** electrical load study, commercial electrical capacity, power demand analysis
**Filename:** `2025-11-20T13:00:00-electrical-load-studies-what-they-are-los-angeles.json`

---

## POST #11: LED Retrofit Guide for Los Angeles Businesses

**Research:** LED retrofit ROI, LADWP commercial rebates, energy savings calculations, tax incentives
**Key Topics:** Cost savings analysis, upfront costs, LADWP rebates, federal tax deductions (179D), ROI timeline, environmental benefits
**Internal Links:** LED retrofit service page, energy efficiency services
**Keywords:** commercial LED retrofit, LED lighting rebates California, energy efficient lighting upgrade
**Filename:** `2025-11-20T14:00:00-led-retrofit-guide-los-angeles-businesses.json`

---

## POST #12: Commercial Electrical Code Compliance for LA Business Owners

**Research:** LA commercial electrical codes, OSHA requirements, inspection process, common violations
**Key Topics:** Building codes, OSHA electrical safety requirements, inspection triggers, common violations, penalty avoidance, tenant improvement requirements
**Internal Links:** Commercial electrical inspection service, commercial safety services
**Keywords:** commercial electrical inspection, business electrical code, OSHA electrical requirements
**Filename:** `2025-11-20T15:00:00-commercial-electrical-code-compliance-los-angeles.json`

---

## POST #13: Complete Guide to Pool and Hot Tub Electrical Requirements in Los Angeles

**Research:** Pool electrical code, bonding and grounding requirements, GFCI for pools, spa wiring
**Key Topics:** NEC Article 680 requirements, GFCI protection, bonding all metal, grounding, dedicated circuits, underwater lighting, permit requirements
**Internal Links:** Pool/spa electrical service pages, GFCI post (#5), residential electrical services
**Keywords:** pool electrical wiring, hot tub electrician Los Angeles, pool bonding requirements
**Filename:** `2025-11-21T10:00:00-pool-hot-tub-electrical-requirements-los-angeles.json`

---

## POST #14: Dedicated Circuits - When and Why Your Home Appliances Need Them

**Research:** Dedicated circuit requirements, appliance electrical needs, circuit sizing, code requirements
**Key Topics:** What dedicated circuits are, which appliances require them (refrigerator, dishwasher, microwave, garbage disposal, bathroom, laundry, range, AC, EV charger), circuit sizing, costs
**Internal Links:** Residential electrical services, panel upgrade posts, EV charger posts
**Keywords:** dedicated circuit requirements, appliance circuit installation, 240V outlet installation
**Filename:** `2025-11-21T11:00:00-dedicated-circuits-when-why-home-appliances-need-them.json`

---

## POST #15: Whole House Generator Installation Guide for Los Angeles Homeowners

**Research:** Standby generator sizing, transfer switch types, fuel options, permit requirements, costs
**Key Topics:** Generator sizing (kW needed), automatic transfer switches, natural gas vs propane, installation process, permits, costs, maintenance, LADWP coordination
**Internal Links:** Residential electrical services, panel upgrade posts, dedicated circuits
**Keywords:** whole house generator installation, backup power Los Angeles, standby generator cost
**Filename:** `2025-11-21T12:00:00-whole-house-generator-installation-guide-los-angeles.json`

---

## POST #16: Smart Home Electrical Wiring - Future-Proofing Your Los Angeles Home

**Research:** Smart home wiring requirements, structured wiring, network infrastructure, power needs
**Key Topics:** Wiring for smart devices, structured wiring systems, network backbone, power considerations, wireless vs wired, planning new construction/renovation, costs
**Internal Links:** Residential electrical services, panel upgrades, dedicated circuits
**Keywords:** smart home wiring, structured wiring Los Angeles, home automation electrical
**Filename:** `2025-11-21T13:00:00-smart-home-electrical-wiring-future-proofing-los-angeles.json`

---

## POST #17: How to Reduce Your Electricity Bill - Electrical Upgrades That Pay for Themselves

**Research:** Energy-saving electrical upgrades, LADWP rates and programs, ROI on electrical efficiency
**Key Topics:** LED lighting, smart thermostats, efficient appliances, solar-ready upgrades, EV charging TOU optimization, LADWP rebates, energy audits
**Internal Links:** LED retrofit, energy efficiency services, EV charger posts (TOU rates), residential services
**Keywords:** reduce electricity bill Los Angeles, energy efficient electrical upgrades, lower power costs
**Filename:** `2025-11-21T14:00:00-how-to-reduce-electricity-bill-electrical-upgrades.json`

---

## POST #18: Common Electrical Problems in Older Los Angeles Homes

**Research:** Old house electrical issues, knob and tube wiring, aluminum wiring, grounding problems
**Key Topics:** Knob and tube wiring, aluminum wiring, insufficient outlets, outdated panels, no grounding, cloth insulation, rewiring costs, safety risks
**Internal Links:** Panel upgrade posts, Federal Pacific/Zinsco post, electrical safety inspection services
**Keywords:** old house electrical problems, knob and tube wiring, aluminum wiring replacement
**Filename:** `2025-11-21T15:00:00-common-electrical-problems-older-los-angeles-homes.json`

---

## POST #19: Electrical Safety Inspection Checklist for Los Angeles Homeowners

**Research:** Home electrical inspection process, safety warning signs, inspection checklist, when to inspect
**Key Topics:** DIY safety checks, professional inspection process, what inspectors look for, warning signs, code violations, when to hire electrician, inspection costs
**Internal Links:** Electrical safety inspection service, panel upgrade posts, warning signs post (#2)
**Keywords:** home electrical inspection, electrical safety check, when to hire electrician
**Filename:** `2025-11-22T10:00:00-electrical-safety-inspection-checklist-los-angeles.json`

---

## POST #20: Understanding Your Los Angeles Electrical Bill

**Research:** LADWP rate structures, time-of-use rates, understanding electric bills, how electrical load affects costs
**Key Topics:** LADWP rate tiers, TOU rates, peak vs off-peak, baseline allowance, how usage affects bills, reducing costs through electrical upgrades
**Internal Links:** Energy efficiency posts, EV charger posts (TOU optimization), LED retrofit
**Keywords:** LADWP electric rates, understanding electric bill, time of use rates California
**Filename:** `2025-11-22T11:00:00-understanding-your-los-angeles-electrical-bill.json`

---

## GENERAL INSTRUCTIONS FOR ALL POSTS

### Before Writing Each Post:

1. **Review sitemap** to find relevant internal links:
```bash
cat /tmp/sitemap.txt | grep -E "(industry-insights|service-areas)" | head -50
```

2. **Search for research topics** using the queries listed for each post

3. **Identify 2-4 blog posts to link to** from sitemap

4. **Identify 1-2 service pages to link to** from sitemap

### Writing Process:

1. Use the HTML structure template above
2. Write in professional but accessible tone
3. Include Los Angeles-specific details throughout
4. Naturally mention Shaffer Construction in introduction and throughout
5. Include FAQ section with 5-7 questions
6. Strong CTA in conclusion with bolded phone number
7. 1,800-2,500 words total

### Creating the JSON File:

```bash
cat > /home/user/shaffercon/content/industry-insights/[FILENAME].json <<'EOF'
{
  "title": "Your Title Here",
  "slug": "your-slug-here",
  "date": "2025-11-19T10:00:00",
  "metaTitle": "Your Title | Shaffer Construction",
  "metaDescription": "Your 150-160 character description here",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your complete HTML content here...</p>"
}
EOF
```

### After Creating Each File:

```bash
# Validate JSON
cat /home/user/shaffercon/content/industry-insights/[FILENAME].json | jq .

# Commit and push
cd /home/user/shaffercon
git add content/industry-insights/[FILENAME].json
git commit -m "Add blog post: [TITLE]"
git push origin claude/review-blog-writing-guide-01FNPZMe7J7ryCTKBtpsbS1W
```

---

## QUALITY CHECKLIST FOR EACH POST

Before finalizing, verify:
- [ ] 1,800-2,500 words
- [ ] 2-4 internal blog post links included
- [ ] 1-2 service page links included
- [ ] All internal links use relative URLs (no target="_blank")
- [ ] Los Angeles mentioned throughout
- [ ] Shaffer Construction mentioned in intro and multiple sections
- [ ] FAQ section included (5-7 questions)
- [ ] Strong CTA with bolded phone number (323-642-8509)
- [ ] Simple HTML only (no CSS or style attributes)
- [ ] Valid JSON format
- [ ] Proper filename format (date-slug.json)
- [ ] SEO keywords naturally integrated
- [ ] Meta description 150-160 characters

---

## TIMELINE

**Suggested Schedule:**
- Day 1: Posts #1-2 (Panel basics)
- Day 2: Posts #3-5 (Panel safety & code)
- Day 3: Posts #6-7 (EV charging basics)
- Day 4: Posts #8-9 (EV advanced & commercial)
- Day 5: Posts #10-12 (Commercial electrical)
- Day 6: Posts #13-14 (Specific equipment)
- Day 7: Posts #15-16 (Generators & smart home)
- Day 8: Posts #17-18 (Energy & old homes)
- Day 9: Posts #19-20 (Safety & billing)
- Day 10: Review and publish all

Each post takes 2-3 hours to research and write properly.

---

## NEED HELP?

If you get stuck:
- Review existing blog posts for style guidance
- Check the main BLOGGING-GUIDE.md for additional details
- Validate JSON at https://jsonlint.com/
- Test locally before pushing if unsure

Good luck writing these evergreen posts! They will drive organic traffic for years to come.
