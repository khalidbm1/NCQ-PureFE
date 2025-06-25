#!/bin/bash

# NCQ Platform - Complete Firebase Deployment
# This script deploys ALL NCQ applications to Firebase

echo "🚀 NCQ PLATFORM - COMPLETE DEPLOYMENT"
echo "===================================="
echo "📍 Firebase Project: ncq-sa"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Installing Firebase CLI...${NC}"
    npm install -g firebase-tools
fi

# Login check
echo -e "${YELLOW}🔐 Checking Firebase authentication...${NC}"
firebase projects:list &> /dev/null || {
    echo -e "${RED}Please login to Firebase first:${NC}"
    firebase login
}

# Use the complete Firebase configuration
echo -e "${YELLOW}📋 Setting up Firebase configuration...${NC}"
cp .firebaserc-all .firebaserc
cp firebase-all.json firebase.json

# Create all hosting sites
echo -e "${BLUE}📱 Creating Firebase hosting sites...${NC}"
firebase use ncq-sa

# List of all apps with their hosting sites
declare -A apps=(
    ["ncq-sa"]="user-portal"
    ["ncq-admin"]="admin-dashboard"
    ["ncq-hospital"]="hospital-management"
    ["ncq-smart-building"]="smart-building"
    ["ncq-api-portal"]="api-portal"
    ["ncq-iot"]="iot-platform"
    ["ncq-llm"]="llm-platform"
    ["ncq-payment"]="payment-gateway"
    ["ncq-payment-admin"]="payment-admin"
    ["ncq-payment-merchant"]="payment-merchant"
    ["ncq-hospitality-staff"]="hospitality-staff"
    ["ncq-hospitality"]="smart-hospitality"
    ["ncq-landing"]="landing-page"
)

# Create hosting sites and apply targets
for site in "${!apps[@]}"; do
    target="${apps[$site]}"
    echo -e "${YELLOW}Setting up $site for $target...${NC}"
    
    # Create site if it doesn't exist
    firebase hosting:sites:list | grep -q "$site" || {
        echo "Creating site: $site"
        firebase hosting:sites:create "$site" || true
    }
    
    # Apply target
    firebase target:apply hosting "$target" "$site"
done

echo ""
echo -e "${BLUE}🏗️  Building all applications...${NC}"
echo -e "${YELLOW}This will take several minutes...${NC}"
echo ""

# Build User Portal
echo -e "${YELLOW}Building User Portal...${NC}"
cd ncq-platform-demo/user-portal
[ -d "node_modules" ] || npm install
npm run build
cd ../..

# Build Admin Dashboard
echo -e "${YELLOW}Building Admin Dashboard...${NC}"
cd ncq-platform-demo/admin-dashboard
[ -d "node_modules" ] || npm install
npm run build
cd ../..

# Build Hospital Management
echo -e "${YELLOW}Building Hospital Management...${NC}"
cd ncq-platform-demo/hospital-management
[ -d "node_modules" ] || npm install
CI=false npm run build
cd ../..

# Build Smart Building
echo -e "${YELLOW}Building Smart Building (with 3D)...${NC}"
cd "../NCQ co/ncq-platform-demo/smart-building"
[ -d "node_modules" ] || npm install
npm run build
cd "../../../NCQ pure FE"

# Build IoT Platform
echo -e "${YELLOW}Building IoT Platform...${NC}"
cd ncq-platform-demo/iot-platform
[ -d "node_modules" ] || npm install
npm run build
cd ../..

# Build Payment Gateway
echo -e "${YELLOW}Building Payment Gateway...${NC}"
cd ncq-platform-demo/payment-gateway
[ -d "node_modules" ] || npm install
npm run build
cd ../..

# Build Landing Page
echo -e "${YELLOW}Building Landing Page...${NC}"
cd ncq-platform-demo/landing-page
[ -d "node_modules" ] || npm install
npm run build
cd ../..

# For Next.js apps that need static export
echo -e "${YELLOW}Preparing Next.js apps for static export...${NC}"

# API Portal
cd ncq-platform-demo/api-portal
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

# LLM Platform
cd ncq-platform-demo/llm-platform
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

# Payment Admin
cd ncq-platform-demo/payment-admin
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

# Payment Merchant
cd ncq-platform-demo/payment-merchant
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

# Hospitality Staff
cd ncq-platform-demo/hospitality-staff
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

# Smart Hospitality
cd ncq-platform-demo/smart-hospitality
[ -d "node_modules" ] || npm install
echo "module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true }" > next.config.js
npm run build
cd ../..

echo ""
echo -e "${BLUE}☁️  Deploying all applications to Firebase...${NC}"
firebase deploy --only hosting

echo ""
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${GREEN}🌐 Your applications are now live:${NC}"
echo ""
echo "  📱 User Portal: https://ncq-sa.web.app"
echo "  👨‍💼 Admin Dashboard: https://ncq-admin.web.app"
echo "  🏥 Hospital Management: https://ncq-hospital.web.app"
echo "  🏢 Smart Building (3D): https://ncq-smart-building.web.app"
echo "  🔌 API Portal: https://ncq-api-portal.web.app"
echo "  📡 IoT Platform: https://ncq-iot.web.app"
echo "  🤖 LLM Platform: https://ncq-llm.web.app"
echo "  💳 Payment Gateway: https://ncq-payment.web.app"
echo "  💰 Payment Admin: https://ncq-payment-admin.web.app"
echo "  🏪 Payment Merchant: https://ncq-payment-merchant.web.app"
echo "  👥 Hospitality Staff: https://ncq-hospitality-staff.web.app"
echo "  🏨 Smart Hospitality: https://ncq-hospitality.web.app"
echo "  🏠 Landing Page: https://ncq-landing.web.app"
echo ""
echo -e "${YELLOW}📊 Firebase Console:${NC}"
echo "  https://console.firebase.google.com/project/ncq-sa/hosting/sites"
echo ""
echo -e "${GREEN}🎉 All NCQ applications have been deployed successfully!${NC}"