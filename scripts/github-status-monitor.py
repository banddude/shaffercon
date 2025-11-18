#!/usr/bin/env python3
"""
GitHub Status Monitor
Monitors GitHub's status RSS feed and announces when new updates are posted
"""

import time
import sys
import subprocess
import xml.etree.ElementTree as ET
from urllib.request import urlopen
from datetime import datetime
import re

RSS_URL = "https://www.githubstatus.com/history.rss"
CHECK_INTERVAL = 30  # seconds between checks

def fetch_rss():
    """Fetch and parse the GitHub status RSS feed"""
    try:
        with urlopen(RSS_URL, timeout=10) as response:
            return response.read()
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return None

def extract_updates(description):
    """Extract individual update messages from the description HTML"""
    # Remove HTML tags and extract the text
    updates = []

    # Pattern to match each update block: <p><small>timestamp</small><br><strong>Type</strong> - Message</p>
    pattern = r'<p>.*?<strong>(.*?)</strong>\s*-\s*(.*?)</p>'
    matches = re.findall(pattern, description, re.DOTALL)

    for update_type, message in matches:
        # Clean up the message (remove remaining HTML)
        message = re.sub(r'<[^>]+>', '', message)
        message = message.strip()

        # Create full update text
        full_text = f"{update_type} - {message}"
        updates.append(full_text)

    return updates

def parse_latest_incident(rss_data):
    """Parse RSS and return the latest incident with its first (newest) update"""
    try:
        root = ET.fromstring(rss_data)
        # Get the first (latest) item
        items = root.findall('.//item')
        if not items:
            return None, None, None

        latest = items[0]
        title = latest.find('title').text if latest.find('title') is not None else ""
        description = latest.find('description').text if latest.find('description') is not None else ""

        # Extract all updates from the description
        updates = extract_updates(description)

        # The first update is the most recent one
        latest_update = updates[0] if updates else None

        return title, latest_update, description
    except Exception as e:
        print(f"Error parsing RSS: {e}")
        return None, None, None

def speak(text):
    """Use macOS 'say' command to speak the text"""
    try:
        subprocess.run(['say', text], check=True)
        return True
    except Exception as e:
        print(f"Error speaking text: {e}")
        return False

def main():
    print("GitHub Status Monitor")
    print("=" * 50)
    print(f"Monitoring: {RSS_URL}")
    print(f"Check interval: {CHECK_INTERVAL} seconds")
    print("Listening for GitHub status updates...")
    print("=" * 50)

    # Initialize with current state and announce it
    rss_data = fetch_rss()
    last_update = None
    if rss_data:
        incident_title, latest_update, description = parse_latest_incident(rss_data)
        if latest_update:
            last_update = latest_update
            print(f"\nCurrent incident: {incident_title}")
            print(f"Latest update: {latest_update}")
            print()

            # Speak the current status
            speak(latest_update)

            print("\n(Will announce new updates as they happen)")
            print()

    while True:
        try:
            rss_data = fetch_rss()
            if rss_data:
                incident_title, latest_update, description = parse_latest_incident(rss_data)

                if latest_update:
                    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                    # Check if this is a new update
                    if latest_update != last_update and last_update is not None:
                        print(f"\n[{timestamp}] New GitHub status update!")
                        print(f"  Incident: {incident_title}")
                        print(f"  Update: {latest_update}")
                        print()

                        # Speak the update
                        speak(latest_update)

                        last_update = latest_update
                    else:
                        # Same status, just show a heartbeat
                        print(f"[{timestamp}] No new updates", end='\r')

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n\nMonitoring stopped by user")
            sys.exit(0)
        except Exception as e:
            print(f"\nUnexpected error: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
