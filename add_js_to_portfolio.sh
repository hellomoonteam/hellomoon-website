#!/bin/bash

# Script to add JavaScript files to all portfolio HTML files
echo "🔄 Adding JavaScript files to portfolio pages..."

# Update all portfolio HTML files
find portfolio/ -name "*.html" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Add JavaScript files before closing body tag
    sed -i '' 's|</body>|    <!-- JavaScript files -->\n    <script src="../js/lib.js"></script>\n    <script src="../js/custom.js"></script>\n\n  </body>|g' "$file"
    
    echo "✅ Updated: $file"
done

echo "🎉 All portfolio files updated with JavaScript!"
echo "📁 Added: ../js/lib.js and ../js/custom.js"
