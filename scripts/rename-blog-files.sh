#!/bin/bash

# Navigate to the blog posts directory
cd /home/user/shaffercon/content/industry-insights

# Rename all 2023 blog post files to remove date/timestamp prefix
for file in 2023-*.json; do
  # Extract slug by removing the YYYY-MM-DDTHH:MM:SS- prefix
  slug=$(echo "$file" | sed 's/^2023-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9]-//')

  # Show what we're doing
  echo "Renaming: $file -> $slug"

  # Perform the rename
  mv "$file" "$slug"
done

echo ""
echo "Rename complete! Total files renamed:"
ls -1 *.json | grep -v "^2023-" | wc -l
