#!/usr/bin/env python3
"""
Expand all 40 Altadena page intros to 500-750 chars with location-specific content.
"""

import sqlite3

# Altadena-specific context
ALTADENA_CONTEXT = """Altadena, nestled in the foothills of the San Gabriel Mountains with stunning views and historic charm, features a mix of craftsman homes, mid-century architecture, and hillside properties. Known for Christmas Tree Lane, the Cobb Estate trails, and close proximity to the Angeles National Forest."""

SERVICE_TEMPLATES = {
    # Residential services
    ('residential', 'backup-generator-installation'): (
        "Protect your Altadena home from power outages with professional backup generator installation. From hillside properties near the Cobb Estate to charming craftsman homes along Christmas Tree Lane, reliable backup power is essential during seasonal outages and fire-season grid shutdowns. Shaffer Construction designs and installs whole-home and partial-home generator systems tailored to Altadena's unique terrain and your specific power needs. We handle site assessment, equipment selection, fuel connections (natural gas or propane), automatic transfer switches, and all permitting. Our installations meet California electrical codes and protect your home office, refrigeration, heating, cooling, and essential circuits. With Altadena's mountain location and beautiful but fire-prone surroundings, a backup generator provides peace of mind when the power goes out."
    ),
    ('commercial', 'backup-generator-installation'): (
        "Keep your Altadena business operational during power outages with professional commercial backup generator installation. From retail shops along Lake Avenue to offices and facilities throughout this hillside community, power reliability is critical for protecting revenue, equipment, and customer service. Shaffer Construction designs and installs commercial generator systems sized to your facility's electrical load—from small standby units to large three-phase systems. We handle load calculations, equipment selection, automatic transfer switches, fuel systems, permits, and full code compliance. Altadena's location in the foothills means power interruptions during fire season and storms are a real concern. Our backup power solutions ensure your business stays running when the grid goes down."
    ),
    ('residential', 'breaker-panel-service-maintenance'): (
        "Keep your Altadena home's electrical system safe and reliable with professional breaker panel service and maintenance. From historic craftsman homes built in the early 1900s to modern hillside residences, your electrical panel is the heart of your home's power distribution. Regular maintenance prevents fires, protects electronics, and ensures your system can handle today's electrical demands—especially important in Altadena's many older homes. Shaffer Construction provides panel inspections, breaker testing, connection tightening, and upgrades when needed. We identify signs of panel failure before they become dangerous or costly emergencies. Whether you're near the Cobb Estate, Christmas Tree Lane, or anywhere in this beautiful mountain-view community, we keep your breaker panel operating safely and efficiently."
    ),
    ('commercial', 'breaker-panel-service-maintenance'): (
        "Ensure your Altadena business stays powered and compliant with expert commercial breaker panel service and maintenance. From Lake Avenue retailers to offices and facilities throughout this foothill community, your electrical panel is critical for safe operations. Regular panel maintenance prevents downtime, identifies problems before they escalate, and ensures your system meets current electrical codes. Shaffer Construction provides comprehensive panel inspections, breaker testing, thermal imaging, connection tightening, and necessary upgrades. We work with Altadena's diverse mix of commercial properties—from historic buildings to modern facilities—and tailor our approach to your property's unique needs. Scheduled maintenance protects your investment and keeps your business running smoothly."
    ),
}

def get_generic_template(service_type, service_name):
    """Generate a generic but location-specific intro for services without specific templates."""
    service_display = service_name.replace('-', ' ').title()

    if service_type == 'residential':
        return (
            f"Enhance your Altadena home with professional {service_display.lower()} services. From the historic craftsman homes near Christmas Tree Lane to hillside properties with mountain views, Altadena residents value quality electrical work that respects their home's character while meeting modern needs. Shaffer Construction brings expertise and attention to detail to every {service_display.lower()} project. We understand Altadena's unique mix of architectural styles and challenging hillside terrain, and we tailor our approach accordingly. Our licensed electricians handle all aspects of {service_display.lower()}—from initial assessment and planning to installation, testing, and final inspection. Whether you're near the Cobb Estate, the Angeles National Forest boundary, or anywhere in this beautiful foothill community, we deliver reliable, code-compliant electrical work that protects your home and family."
        )
    else:  # commercial
        return (
            f"Keep your Altadena business powered and compliant with professional {service_display.lower()} services. From Lake Avenue commercial properties to offices and facilities throughout this foothill community, reliable electrical systems are essential for smooth operations. Shaffer Construction provides expert {service_display.lower()} tailored to commercial properties of all types and sizes. We understand the unique needs of Altadena businesses—from historic buildings requiring sensitive upgrades to modern facilities demanding high-capacity systems. Our team handles planning, installation, testing, permits, and inspections with minimal disruption to your operations. Whether you're preparing for growth, addressing compliance issues, or maintaining your electrical infrastructure, we deliver professional results that keep your business running safely and efficiently."
        )

db = sqlite3.connect('./database/data/site.db')
cursor = db.cursor()

# Get all Altadena pages
cursor.execute('''
    SELECT id, service_name, service_type, LENGTH(hero_intro) as current_len
    FROM service_pages
    WHERE location = 'altadena'
    ORDER BY id
''')
pages = cursor.fetchall()

print(f'=== Expanding {len(pages)} Altadena page intros ===\n')

updated = 0
for page_id, service_name, service_type, current_len in pages:
    # Get template if available, otherwise use generic
    key = (service_type, service_name)
    if key in SERVICE_TEMPLATES:
        new_intro = SERVICE_TEMPLATES[key]
    else:
        new_intro = get_generic_template(service_type, service_name)

    # Update the page
    cursor.execute('''
        UPDATE service_pages
        SET hero_intro = ?
        WHERE id = ?
    ''', (new_intro, page_id))

    updated += 1
    print(f'✓ {service_type:12s} {service_name:40s} ({current_len} → {len(new_intro)} chars)')

db.commit()
print(f'\n=== Updated {updated} pages ===')
print('All changes committed to database')

db.close()
