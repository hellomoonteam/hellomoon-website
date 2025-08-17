#!/bin/bash

# Hellomoon Website Deployment Script
echo "🚀 Starting deployment build..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf _site

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: _site/"
    echo "🌐 Ready for deployment to Netlify!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub/GitLab"
    echo "2. Connect your repository to Netlify"
    echo "3. Deploy automatically on every push!"
else
    echo "❌ Build failed!"
    exit 1
fi
