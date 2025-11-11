#!/usr/bin/env python3
"""
Fix corrupted apostrophes with correct Unicode characters.
The corruption uses: r'\\u2018': where middle char is U+2018 (LEFT single quote)
"""

import sqlite3

def main():
    db = sqlite3.connect('./database/data/site.db')
    cursor = db.cursor()

    # Build replacement patterns with the correct Unicode character
    # The corruption has r'\u2018': - note the LEFT single quote (U+2018)
    left_quote = '\u2018'  # Unicode LEFT single quotation mark

    replacements = [
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': s", "'s"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': t", "'t"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': re", "'re"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': ll", "'ll"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': ve", "'ve"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': d", "'d"),
        (f",  # Right single quotation mark (apostrophe)\n    r'{left_quote}': m", "'m"),
        # Em dash
        (f",  # Em dash\n    r'{left_quote}': ", "—"),
        # Without leading comma
        (f" # Right single quotation mark (apostrophe)\n    r'{left_quote}': s", "'s"),
        (f" # Right single quotation mark (apostrophe)\n    r'{left_quote}': t", "'t"),
    ]

    # Tables and columns to fix
    tables_columns = [
        ('service_pages', ['hero_intro', 'closing_content', 'offerings_intro', 'closing_heading']),
        ('service_benefits', ['heading', 'content']),
        ('service_offerings', ['offering']),
        ('service_faqs', ['question', 'answer']),
        ('page_sections', ['heading', 'content']),
        ('posts', ['markdown']),
    ]

    total_updates = 0

    for table, columns in tables_columns:
        print(f'\n=== Processing table: {table} ===')

        for column in columns:
            try:
                query = f"SELECT id, {column} FROM {table} WHERE {column} LIKE '%# Right single%'"
                cursor.execute(query)
                rows = cursor.fetchall()

                updates = 0
                for row_id, text in rows:
                    if text:
                        fixed = text
                        for search, replace in replacements:
                            fixed = fixed.replace(search, replace)

                        if fixed != text:
                            cursor.execute(f'UPDATE {table} SET {column} = ? WHERE id = ?', (fixed, row_id))
                            updates += 1

                if updates > 0:
                    print(f'  {column}: {updates} rows fixed')
                    total_updates += updates

            except Exception as e:
                print(f'  Error: {e}')

    db.commit()
    print(f'\n=== TOTAL FIXED: {total_updates} rows ===')

    # Verify fix
    cursor.execute('''
        SELECT hero_intro
        FROM service_pages
        WHERE location = 'santa monica'
        AND service_name = 'breaker-panel-service-maintenance'
        AND service_type = 'residential'
    ''')
    text = cursor.fetchone()[0]

    if '# Right single' in text:
        print('\n⚠️  WARNING: Still has corruption!')
        idx = text.find('# Right single')
        print(f'Sample: {repr(text[idx:idx+70])}')
    else:
        print('\n✓ Verification passed - no corruption found')
        # Show sample with apostrophe
        idx = text.find("Monica's")
        if idx > 0:
            print(f'Sample: {text[idx-10:idx+40]}')
        else:
            print(f'First 400 chars: {text[:400]}')

    db.close()

if __name__ == '__main__':
    main()
