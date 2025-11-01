#!/usr/bin/env python3
"""
Convert all 235 blog posts to markdown format and store in a markdown field.
"""

import sqlite3
import json
import html
import re

def html_to_markdown(html_content: str) -> str:
    """Convert HTML to basic markdown"""
    if not html_content:
        return ''

    # Decode HTML entities
    text = html.unescape(html_content)

    # Remove script and style tags
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert headings
    text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<h4[^>]*>(.*?)</h4>', r'#### \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<h5[^>]*>(.*?)</h5>', r'##### \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<h6[^>]*>(.*?)</h6>', r'###### \1\n', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert strong/bold
    text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert em/italic
    text = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert links
    text = re.sub(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert lists
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<ul[^>]*>(.*?)</ul>', r'\1', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<ol[^>]*>(.*?)</ol>', r'\1', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert paragraphs
    text = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', text, flags=re.DOTALL | re.IGNORECASE)

    # Convert line breaks
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)

    # Remove remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Clean up whitespace
    text = re.sub(r'\n\n\n+', '\n\n', text)
    text = text.strip()

    return text

def convert_post_to_markdown(post_id: int, slug: str, title: str, parsed_content: str) -> str:
    """Convert a single post to markdown format"""

    # Start with frontmatter
    markdown = f"# {html.unescape(title)}\n\n"

    # Use parsed content with structure
    if parsed_content:
        try:
            parsed = json.loads(parsed_content)
            all_text = parsed.get('all_text_content', [])

            # Add text content if available
            if all_text:
                markdown += "\n\n"
                for text in all_text:
                    if text and len(text) > 10:  # Skip very short items
                        markdown += html.unescape(text) + "\n\n"

        except:
            pass  # If JSON parsing fails, we already have content from HTML

    return markdown.strip()

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add markdown column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN markdown TEXT")
        print("Added markdown column to posts table")
    except:
        print("Markdown column already exists")

    # Get all posts
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM posts
        ORDER BY id
    """)

    posts = cursor.fetchall()

    print(f"\nConverting {len(posts)} blog posts to markdown...")
    print("=" * 60)

    converted = 0
    for post_id, slug, title, parsed_content in posts:
        try:
            markdown = convert_post_to_markdown(post_id, slug, title, parsed_content)

            cursor.execute("""
                UPDATE posts
                SET markdown = ?
                WHERE id = ?
            """, (markdown, post_id))

            converted += 1
            if converted % 25 == 0:
                print(f"  Converted {converted} posts...")

        except Exception as e:
            print(f"  Error converting {slug}: {e}")

    conn.commit()
    conn.close()

    print("=" * 60)
    print(f"✅ Converted {converted}/{len(posts)} blog posts to markdown!")

if __name__ == '__main__':
    main()
