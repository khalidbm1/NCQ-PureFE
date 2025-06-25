#!/bin/bash

# Deploy Smart Building with 3D Visualization to Firebase

echo "🏢 Deploying Smart Building with 3D Visualization"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Path to smart building
SMART_BUILDING_PATH="../NCQ co/ncq-platform-demo/smart-building"

# Check if directory exists
if [ ! -d "$SMART_BUILDING_PATH" ]; then
    echo -e "${RED}❌ Smart Building directory not found!${NC}"
    exit 1
fi

# Navigate to smart building directory
cd "$SMART_BUILDING_PATH"

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf out .next

echo -e "${YELLOW}🔨 Building Smart Building application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Navigate back to NCQ pure FE for Firebase deployment
cd "../../../NCQ pure FE"

# Check Firebase authentication
echo -e "${YELLOW}🔐 Checking Firebase authentication...${NC}"
firebase projects:list &> /dev/null || {
    echo -e "${RED}Please login to Firebase first:${NC}"
    firebase login
}

# Use the ncq-sa project
firebase use ncq-sa

# Create hosting site if needed
echo -e "${YELLOW}📱 Setting up Firebase hosting site...${NC}"
firebase hosting:sites:list | grep -q "ncq-smart-building" || {
    echo "Creating hosting site: ncq-smart-building"
    firebase hosting:sites:create ncq-smart-building || true
}

# Apply hosting target
firebase target:apply hosting smart-building ncq-smart-building

# Create temporary firebase.json for smart building
cat > firebase-smart-building.json << EOF
{
  "hosting": {
    "target": "smart-building",
    "public": "../NCQ co/ncq-platform-demo/smart-building/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|jsx|ts|tsx)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
EOF

# Deploy using the temporary config
echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"
firebase deploy --only hosting:smart-building --config firebase-smart-building.json

# Cleanup
rm firebase-smart-building.json

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${GREEN}🌐 Smart Building is now live at:${NC}"
echo -e "${BLUE}   https://ncq-smart-building.web.app${NC}"
echo ""
echo -e "${YELLOW}✨ Features:${NC}"
echo "   • 3D Building Visualization with Babylon.js"
echo "   • Interactive floor navigation"
echo "   • Real-time IoT device monitoring"
echo "   • Room selection and details"
echo "   • 2D/3D view toggle"
echo ""
echo -e "${GREEN}🎉 Success!${NC}"