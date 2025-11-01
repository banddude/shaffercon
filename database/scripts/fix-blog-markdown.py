#!/usr/bin/env python3
"""
Fix blog post markdown to properly include:
- H2 headings with ##
- Links in [text](url) format
- Hero images at the top
"""

import sqlite3
import json
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent / "data" / "site.db"

def convert_to_markdown(post_id, title, parsed_content_str, og_image):
    """Convert parsed_content JSON to proper markdown"""

    try:
        parsed = json.loads(parsed_content_str)
    except:
        print(f"  ⚠ Could not parse JSON for post {post_id}")
        return None

    markdown_parts = []

    # Add title as H1
    markdown_parts.append(f"# {title}\n\n")

    # Add hero image if available
    if og_image:
        markdown_parts.append(f"![{title}]({og_image})\n\n")

    # Get all text content
    all_text = parsed.get("all_text_content", [])
    headings = parsed.get("headings", [])
    links = parsed.get("links", [])

    # Create a map of heading text to level
    heading_map = {}
    for h in headings:
        heading_map[h["text"]] = h["level"]

    # Create a map of link text to href
    link_map = {}
    for link in links:
        # Store both exact match and cleaned versions
        link_text = link["text"]
        link_map[link_text] = link["href"]
        # Also store lowercase version for case-insensitive matching
        link_map[link_text.lower()] = link["href"]

    # Process each text block
    for i, text in enumerate(all_text):
        text = text.strip()
        if not text:
            continue

        # Check if this text is a heading
        if text in heading_map:
            level = heading_map[text]
            if level == "h2":
                markdown_parts.append(f"## {text}\n\n")
            elif level == "h3":
                markdown_parts.append(f"### {text}\n\n")
            elif level == "h4":
                markdown_parts.append(f"#### {text}\n\n")
            else:
                markdown_parts.append(f"## {text}\n\n")
        else:
            # Regular paragraph - check for links and convert them
            processed_text = text

            # Sort links by length (longest first) to avoid partial replacements
            sorted_links = sorted(link_map.items(), key=lambda x: len(x[0]), reverse=True)

            for link_text, link_href in sorted_links:
                # Try exact match first
                if link_text in processed_text:
                    markdown_link = f"[{link_text}]({link_href})"
                    processed_text = processed_text.replace(link_text, markdown_link)

            markdown_parts.append(f"{processed_text}\n\n")

    return "".join(markdown_parts).strip()

def main():
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get all posts
    cursor.execute("""
        SELECT id, title, parsed_content, og_image, slug
        FROM posts
        ORDER BY id
    """)

    posts = cursor.fetchall()
    total = len(posts)

    print(f"Converting {total} blog posts to proper markdown...\n")

    success_count = 0
    error_count = 0

    for post_id, title, parsed_content, og_image, slug in posts:
        print(f"Processing: {slug}")

        markdown = convert_to_markdown(post_id, title, parsed_content, og_image)

        if markdown:
            cursor.execute("""
                UPDATE posts
                SET markdown = ?
                WHERE id = ?
            """, (markdown, post_id))
            success_count += 1
            print(f"  ✓ Converted successfully")
        else:
            error_count += 1
            print(f"  ✗ Failed to convert")

    # Commit changes
    conn.commit()
    conn.close()

    print(f"\n✅ Conversion complete!")
    print(f"   Success: {success_count}")
    print(f"   Errors: {error_count}")
    print(f"   Total: {total}")

if __name__ == "__main__":
    main()
