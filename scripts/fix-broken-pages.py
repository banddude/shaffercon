#!/usr/bin/env python3
"""
Fix the 2 broken pages with completely wrong content.
"""

import sqlite3

db = sqlite3.connect('./database/data/site.db')
cursor = db.cursor()

# Fix Page 81: Silver Lake - commercial electrical-troubleshooting-repairs
silver_lake_intro = """Keep your Silver Lake business powered and operational with fast, professional electrical troubleshooting and repairs. From the creative studios and boutique shops along Sunset Boulevard to the cafes and restaurants near the reservoir, electrical issues can halt operations and cost you revenue. Shaffer Construction provides expert diagnostics and reliable repairs for all commercial electrical problems—flickering lights, tripped breakers, power outages, faulty outlets, and more. Our licensed electricians use advanced testing equipment to quickly identify root causes and implement lasting solutions. We understand Silver Lake's unique mix of historic buildings and modern spaces, and we tailor our approach to your property's specific needs. Available for emergency service and scheduled maintenance."""

cursor.execute('''
    UPDATE service_pages
    SET hero_intro = ?
    WHERE id = 81
''', (silver_lake_intro,))

print('✓ Fixed Silver Lake page (ID 81)')

# Fix Page 216: Boyle Heights - commercial electrical-code-compliance-corrections
boyle_heights_intro = """Ensure your Boyle Heights commercial property meets all electrical code requirements with expert compliance and correction services. From the established businesses along Cesar Chavez Avenue to the growing developments near Mariachi Plaza, electrical code violations can result in fines, failed inspections, and safety hazards. Shaffer Construction specializes in bringing commercial properties up to current California Electrical Code standards. We handle permit applications, coordinate inspections with the City of Los Angeles, and complete all necessary corrections—outdated panels, improper grounding, insufficient GFCI protection, overloaded circuits, and more. Whether you're preparing for a property sale, addressing violations, or ensuring ongoing compliance, our team delivers thorough, code-compliant work that protects your business and investment."""

cursor.execute('''
    UPDATE service_pages
    SET hero_intro = ?
    WHERE id = 216
''', (boyle_heights_intro,))

print('✓ Fixed Boyle Heights page (ID 216)')

# Add offerings to both pages
silver_lake_offerings = [
    "Emergency electrical troubleshooting and repair",
    "Circuit breaker diagnostics and replacement",
    "Power outage investigation and resolution",
    "Faulty outlet and switch repair",
    "Lighting system troubleshooting",
    "Equipment electrical failure diagnosis",
    "Panel inspection and fault detection",
    "Wiring integrity testing and repair",
    "Ground fault and GFCI troubleshooting",
    "Voltage drop analysis and correction",
    "Emergency generator connection issues",
    "Electrical safety inspections",
]

boyle_heights_offerings = [
    "Electrical code compliance assessment",
    "Violation correction and remediation",
    "Panel upgrades to meet current code",
    "GFCI and AFCI protection installation",
    "Proper grounding system installation",
    "Circuit load balancing and correction",
    "Emergency exit lighting compliance",
    "Electrical permit coordination",
    "City inspection scheduling and support",
    "Documentation and compliance certification",
    "Historic building electrical updates",
    "Commercial safety compliance upgrades",
]

# Add offerings for Silver Lake
for i, offering in enumerate(silver_lake_offerings):
    cursor.execute('''
        INSERT INTO service_offerings (service_page_id, offering, offering_order)
        VALUES (81, ?, ?)
    ''', (offering, i))

print(f'✓ Added {len(silver_lake_offerings)} offerings to Silver Lake page')

# Add offerings for Boyle Heights
for i, offering in enumerate(boyle_heights_offerings):
    cursor.execute('''
        INSERT INTO service_offerings (service_page_id, offering, offering_order)
        VALUES (216, ?, ?)
    ''', (offering, i))

print(f'✓ Added {len(boyle_heights_offerings)} offerings to Boyle Heights page')

# Add FAQs for Silver Lake
silver_lake_faqs = [
    ("How quickly can you respond to electrical emergencies in Silver Lake?",
     "We offer same-day emergency service for Silver Lake businesses. Our team can typically arrive within 1-2 hours for urgent electrical issues that affect your operations. We're available 24/7 for critical repairs."),

    ("What electrical problems are most common in Silver Lake commercial buildings?",
     "Common issues in Silver Lake's mix of historic and modern commercial spaces include outdated wiring, overloaded circuits, faulty breakers, lighting failures, and power quality problems. Many older buildings need upgrades to handle modern electrical demands."),

    ("Do you provide preventive maintenance to avoid future electrical problems?",
     "Yes, we offer comprehensive electrical maintenance programs that include regular inspections, testing, and preventive repairs. This proactive approach helps identify potential issues before they cause downtime or costly emergency repairs."),

    ("Are your electricians licensed to work on commercial properties in Los Angeles?",
     "Absolutely. All our electricians are licensed, bonded, and insured for commercial electrical work in Los Angeles. We hold the necessary C-10 electrical contractor license and maintain full compliance with city requirements."),
]

for i, (question, answer) in enumerate(silver_lake_faqs):
    cursor.execute('''
        INSERT INTO service_faqs (service_page_id, question, answer, faq_order)
        VALUES (81, ?, ?, ?)
    ''', (question, answer, i))

print(f'✓ Added {len(silver_lake_faqs)} FAQs to Silver Lake page')

# Add FAQs for Boyle Heights
boyle_heights_faqs = [
    ("What types of code violations do you commonly fix in Boyle Heights?",
     "Common violations include outdated electrical panels, missing GFCI protection, improper grounding, overloaded circuits, incorrect wire sizing, and non-compliant installations. We also address violations related to emergency lighting, exit signs, and accessibility requirements."),

    ("How long does it take to correct electrical code violations?",
     "Simple corrections can often be completed in 1-2 days, while comprehensive upgrades may take several days to weeks depending on the scope. We provide detailed timelines during our initial assessment and work efficiently to minimize disruption to your business."),

    ("Will you handle all permits and inspections with the City of Los Angeles?",
     "Yes, we manage the entire permit process including applications, scheduling inspections, and coordinating with city inspectors. We ensure all work meets or exceeds Los Angeles electrical code requirements and passes inspection on the first attempt."),

    ("Can you work with my insurance company if violations were found during an inspection?",
     "Absolutely. We regularly work with insurance companies and provide detailed documentation of all corrections made. We can coordinate directly with your insurer to ensure all requirements are met for continued coverage or policy renewal."),
]

for i, (question, answer) in enumerate(boyle_heights_faqs):
    cursor.execute('''
        INSERT INTO service_faqs (service_page_id, question, answer, faq_order)
        VALUES (216, ?, ?, ?)
    ''', (question, answer, i))

print(f'✓ Added {len(boyle_heights_faqs)} FAQs to Boyle Heights page')

db.commit()
print('\n=== All fixes committed to database ===')

db.close()
