#!/bin/bash

# Download all WordPress images from shaffercon.com
# Uses WordPress REST API to fetch all media files

WP_URL="https://shaffercon.com"
WP_API="$WP_URL/wp-json/wp/v2/media"
OUTPUT_DIR="./downloaded_images"
CREDENTIALS="mikejshaffer@gmail.com:dd6b n9V7 n02X S7W2 mgL8 wLn5"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Downloading all WordPress images from $WP_URL..."
echo "Output directory: $OUTPUT_DIR"
echo ""

# Get all media items from WordPress REST API
# The API returns paginated results, so we need to fetch all pages
PAGE=1
TOTAL_DOWNLOADED=0
TOTAL_FAILED=0

while true; do
  echo "Fetching page $PAGE of media files..."

  # Fetch JSON response with pagination
  RESPONSE=$(curl -s "$WP_API?page=$PAGE&per_page=100" \
    -u "$CREDENTIALS")

  # Check if response is empty (no more pages)
  if [ "$(echo "$RESPONSE" | jq 'length' 2>/dev/null)" -eq 0 ]; then
    echo "No more pages to fetch."
    break
  fi

  # Extract image URLs and download them
  echo "$RESPONSE" | jq -r '.[] | .source_url' 2>/dev/null | while read -r URL; do
    if [ -n "$URL" ]; then
      # Extract filename from URL
      FILENAME=$(basename "$URL" | cut -d'?' -f1)
      FILEPATH="$OUTPUT_DIR/$FILENAME"

      # Skip if file already exists
      if [ -f "$FILEPATH" ]; then
        echo "  ✓ Already downloaded: $FILENAME"
      else
        # Download the image
        echo "  ↓ Downloading: $FILENAME"
        if curl -s -o "$FILEPATH" "$URL"; then
          echo "    Success: $FILENAME"
          ((TOTAL_DOWNLOADED++))
        else
          echo "    Failed: $FILENAME (from $URL)"
          ((TOTAL_FAILED++))
          rm -f "$FILEPATH"
        fi
      fi
    fi
  done

  # Check if there are more pages
  LINK_HEADER=$(curl -s -I "$WP_API?page=$PAGE&per_page=100" \
    -u "$CREDENTIALS" | grep -i "link:")

  if ! echo "$LINK_HEADER" | grep -q 'rel="next"'; then
    break
  fi

  ((PAGE++))
done

echo ""
echo "Download complete!"
echo "Downloaded: $TOTAL_DOWNLOADED images"
echo "Failed: $TOTAL_FAILED images"
echo "Location: $OUTPUT_DIR"
echo ""
echo "To see all downloaded images:"
echo "  ls -lh $OUTPUT_DIR"
