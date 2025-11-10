# Pacific Palisades Service Pages - Content Requirements

## Overview
Generate complete, engaging, and SEO-optimized content for all 40 Pacific Palisades electrical service pages. Content must be tailored to Pacific Palisades' unique characteristics while maintaining consistency with the existing site content structure.

## About Pacific Palisades

### Location Context
- **Location**: Affluent coastal neighborhood in Los Angeles, California
- **Geography**: Nestled between Santa Monica Mountains and Pacific Ocean
- **Demographics**: High-income residential area with luxury homes, estates, and beachfront properties
- **Architecture**: Mix of mid-century modern, Mediterranean, and contemporary luxury homes
- **Notable Features**:
  - Stunning ocean views and hillside properties
  - Proximity to beaches (Will Rogers State Beach, Sunset Beach)
  - Village atmosphere with local shops and restaurants
  - Home to Getty Villa museum
  - Known for excellent schools and family-friendly environment
  - Celebrity residents and high property values

### Electrical Service Context
- Many large homes with high electrical demands
- Older homes may need electrical upgrades for modern appliances
- EV adoption high due to affluent, eco-conscious residents
- Outdoor living spaces (pools, patios, landscape lighting)
- Smart home automation popular
- High standards for quality and aesthetics

### Nearby Areas for Cross-Linking
Use these 5 nearby areas (in this order):
1. Santa Monica
2. Venice
3. Beverly Hills
4. West Hollywood
5. Culver City

## Database Schema & Fields to Populate

### Tables to Update

#### 1. `service_offerings` table
- **Fields**: `service_page_id`, `offering`, `offering_order`
- **Requirements**:
  - Generate 12-15 specific offerings per page
  - Each offering should be a concise bullet point (3-8 words)
  - Focus on specific tasks/services related to the service type
  - Use industry-standard terminology
  - Order from most common to specialized services

#### 2. `service_faqs` table
- **Fields**: `service_page_id`, `question`, `answer`, `faq_order`
- **Requirements**:
  - Generate 4-5 FAQs per page
  - Questions should be location-specific (mention "Pacific Palisades")
  - Questions should be conversational and natural (what real customers ask)
  - Answers should be 2-4 sentences, informative but not overly technical
  - Include benefits of using Shaffer Construction
  - NO PRICING INFORMATION
  - End with call-to-action when appropriate

#### 3. `service_related_services` table
- **Fields**: `service_page_id`, `service_name`, `service_url`, `display_order`
- **Requirements**:
  - Select 5 related services from the same location (Pacific Palisades)
  - Mix of residential and commercial where appropriate
  - Services should be logically related or complementary
  - Use proper service names from the database
  - URLs should follow pattern: `/service-areas/pacific-palisades/{residential|commercial}-{service-slug}`

#### 4. `service_nearby_areas` table
- **Fields**: `service_page_id`, `area_name`, `area_url`, `display_order`
- **Requirements**:
  - Use exactly these 5 areas in this order:
    1. Santa Monica → `/service-areas/santa-monica`
    2. Venice → `/service-areas/venice`
    3. Beverly Hills → `/service-areas/beverly-hills`
    4. West Hollywood → `/service-areas/west-hollywood`
    5. Culver City → `/service-areas/culver-city`
  - Area names should be proper title case

## Content Style Guidelines

### Voice & Tone
- **Professional yet approachable**: We're experts, but friendly
- **Confident**: Shaffer Construction is the trusted choice
- **Location-aware**: Reference Pacific Palisades characteristics naturally
- **Customer-focused**: Emphasize benefits and solutions, not just features
- **Safety-conscious**: Highlight code compliance, permits, quality workmanship

### SEO Best Practices
- **Primary keyword**: Service name + "Pacific Palisades" (e.g., "EV charger installation Pacific Palisades")
- **Secondary keywords**: Variations like "electrical service in Pacific Palisades", "{service} near me"
- **Natural integration**: Keywords should flow naturally, not feel forced
- **Long-tail keywords**: In FAQs, use conversational long-tail questions
- **Semantic keywords**: Include related terms (e.g., for EV chargers: "electric vehicle", "charging station", "Level 2 charger")
- **Local SEO**: Reference nearby landmarks, neighborhoods, local characteristics

### Content Quality Standards
- **Engaging**: Read naturally, not like template content
- **Informative**: Provide value, answer real questions
- **Unique**: Don't copy-paste; each page should feel custom
- **Specific**: Use concrete details, not vague generalizations
- **Scannable**: Use clear, concise bullet points
- **Error-free**: Perfect grammar, spelling, punctuation

## What NOT to Include

❌ **NO PRICING INFORMATION**
- Don't mention specific prices, costs, or rates
- Don't say "affordable" or make price claims
- OK to say "free estimates" or "complimentary consultations"

❌ **NO FALSE CLAIMS**
- Don't guarantee specific timelines without qualifiers
- Don't make absolute promises about results
- Don't claim to be "the best" without context

❌ **NO GENERIC FILLER**
- Avoid clichés like "your trusted partner"
- Don't use meaningless phrases like "quality service"
- Every sentence should provide real information or value

## Content Generation Process

### For Each Page:

1. **Research Phase**:
   - Review sample content from other locations (especially Hollywood)
   - Understand the specific service and its applications
   - Consider how this service applies to Pacific Palisades homes/businesses
   - Identify related services and complementary offerings

2. **Offerings Generation** (12-15 items):
   - List specific tasks/services offered
   - Start with core services, progress to specialized
   - Use consistent terminology with other pages
   - Examples:
     - ✓ "Level 2 EV charger installation"
     - ✓ "Home electrical panel upgrades"
     - ✓ "Load calculation and system design"

3. **FAQ Generation** (4-5 items):
   - Write customer-focused questions that mention "Pacific Palisades"
   - Answer with 2-4 informative sentences
   - Weave in benefits of using Shaffer Construction
   - Include local context where relevant
   - Example:
     - Q: "How long does a typical residential EV charger installation take in Pacific Palisades?"
     - A: "Residential EV charger installations in Pacific Palisades are usually completed within one day, though the timeline depends on your home's existing electrical setup and whether panel upgrades are needed. Shaffer Construction handles every aspect—from permits to final inspection—ensuring a smooth, code-compliant installation. We work efficiently to minimize disruption to your daily routine while delivering safe, reliable charging for your electric vehicle."

4. **Related Services** (5 items):
   - Select logically related Pacific Palisades services
   - Mix residential and commercial appropriately
   - Ensure URLs are correct format
   - Example for EV Charger page:
     - Residential Whole Building Surge Protection
     - Residential Electrical Panel Upgrades
     - Residential Dedicated Equipment Circuits
     - Commercial EV Charger Installation
     - Residential Smart Automation Systems

5. **Nearby Areas** (5 items):
   - Use the standardized list: Santa Monica, Venice, Beverly Hills, West Hollywood, Culver City
   - These locations are verified to exist in the database
   - Use proper URL format

## Database Update Format

Content should be inserted into the database using SQL INSERT statements in this format:

```sql
-- Offerings
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (806, 'Level 2 EV charger installation', 1),
  (806, 'Home electrical panel upgrades', 2),
  -- ... etc

-- FAQs
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (806, 'How long does...?', 'Answer text...', 1),
  -- ... etc

-- Related Services
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (806, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 1),
  -- ... etc

-- Nearby Areas
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (806, 'Santa Monica', '/service-areas/santa-monica', 1),
  -- ... etc
```

## Quality Checklist

Before submitting content, verify:

- [ ] 12-15 service offerings generated
- [ ] 4-5 FAQs with Pacific Palisades-specific questions
- [ ] 5 related services with correct URLs
- [ ] 5 nearby areas with correct URLs
- [ ] All content is engaging and naturally written
- [ ] Keywords integrated naturally for SEO
- [ ] No pricing information included
- [ ] No spelling or grammar errors
- [ ] Content is unique (not copy-pasted from other pages)
- [ ] All database IDs and field names are correct
- [ ] SQL syntax is valid

## Reference Files

- `/home/user/shaffercon/pacific-palisades-pages.json` - List of all 40 pages to complete
- `/home/user/shaffercon/sample-page-content.json` - Example of complete page content
- `/home/user/shaffercon/database/data/site.db` - Database to update

## Success Criteria

Content is complete when:
1. All 40 Pacific Palisades pages have 12-15 offerings
2. All 40 pages have 4-5 FAQs
3. All 40 pages have 5 related services
4. All 40 pages have 5 nearby areas
5. All content meets quality and SEO standards
6. All database updates execute without errors
7. Content is verified to display correctly on the website
