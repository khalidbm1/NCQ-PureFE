#!/bin/bash

echo "🚀 Starting NCQ Platform deployment process..."

# Navigate to user-portal directory
echo "📁 Navigating to user-portal directory..."
cd ncq-platform/frontend/user-portal

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Go back to root directory
cd ../../..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: https://ncq-sa.web.app"
    echo ""
    echo "📝 Remember to:"
    echo "  - Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)"
    echo "  - Or open in an incognito/private window"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi