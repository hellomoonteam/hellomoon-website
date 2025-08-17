#!/bin/bash

# Script to update all portfolio files to remove Imgix and use direct image paths
echo "🔄 Updating portfolio files to remove Imgix dependencies..."

# Update all portfolio HTML files
find portfolio/ -name "*.html" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Replace Jekyll asset URLs with direct paths
    sed -i '' 's|{{ site\[jekyll\.environment\]\.asset_url }}|../images/|g' "$file"
    
    # Remove imgix-fluid class
    sed -i '' 's/class="[^"]*imgix-fluid[^"]*"/class=""/g' "$file"
    sed -i '' 's/class="imgix-fluid[^"]*"/class=""/g' "$file"
    sed -i '' 's/class="[^"]*imgix-fluid"/class=""/g' "$file"
    sed -i '' 's/class="imgix-fluid"/class=""/g' "$file"
    
    # Clean up empty class attributes
    sed -i '' 's/class=""//g' "$file"
    sed -i '' 's/class=" "/class="/g' "$file"
    sed -i '' 's/class=" "/class="/g' "$file"
    
    echo "✅ Updated: $file"
done

echo "🎉 All portfolio files updated!"
echo "📁 Images now reference: ../images/"
echo "🚫 Removed: imgix-fluid classes and Jekyll asset URLs"
