#!/bin/bash

# Smart Building - Firebase Deployment Script
# Deploying to Firebase Project: ncq-sa

echo "🏢 Smart Building - Firebase Deployment"
echo "======================================"
echo "📍 Firebase Project: ncq-sa"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command_exists firebase; then
    echo -e "${YELLOW}⚠️  Firebase CLI is not installed. Installing...${NC}"
    npm install -g firebase-tools
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf out .next

# Build the application
echo -e "${YELLOW}🔨 Building the application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Build failed. Please check for errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Check if we need to create the hosting site
echo -e "${YELLOW}🔍 Checking Firebase hosting configuration...${NC}"
firebase hosting:sites:list 2>/dev/null | grep -q "ncq-smart-building" || {
    echo -e "${YELLOW}📱 Creating hosting site for smart-building...${NC}"
    firebase hosting:sites:create ncq-smart-building || {
        echo -e "${YELLOW}ℹ️  Hosting site might already exist or you need to set it up manually${NC}"
    }
}

# Apply hosting target
echo -e "${YELLOW}🎯 Applying hosting target...${NC}"
firebase target:apply hosting smart-building ncq-smart-building

# Deploy to Firebase
echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"
firebase deploy --only hosting:smart-building

# Check deployment status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your app is now live on Firebase Hosting${NC}"
    
    # Display the hosting URLs
    echo -e "${GREEN}🔗 Your app is available at:${NC}"
    echo -e "${GREEN}   - https://ncq-smart-building.web.app${NC}"
    echo -e "${GREEN}   - https://ncq-sa.web.app/smart-building${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment complete!${NC}"