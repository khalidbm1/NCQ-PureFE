#!/bin/bash

# NCQ Platform - Complete Firebase Deployment Script
# Deploys ALL applications to Firebase Project: ncq-sa

echo "🚀 NCQ Platform - Complete Deployment"
echo "====================================="
echo "📍 Firebase Project: ncq-sa"
echo "📦 Deploying ALL applications"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base directories
BASE_DIR=$(pwd)
NCQ_PLATFORM_DIR="$BASE_DIR/ncq-platform-demo"
NCQ_CO_DIR="$BASE_DIR/../NCQ co/ncq-platform-demo"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists firebase; then
    echo -e "${YELLOW}⚠️  Firebase CLI is not installed. Installing...${NC}"
    npm install -g firebase-tools
fi

# Function to deploy an app
deploy_app() {
    local app_name=$1
    local app_path=$2
    local hosting_target=$3
    local build_command=${4:-"npm run build"}
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📦 Deploying: $app_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Check if directory exists
    if [ ! -d "$app_path" ]; then
        echo -e "${RED}❌ Directory not found: $app_path${NC}"
        echo -e "${YELLOW}⏭️  Skipping $app_name${NC}"
        return 1
    fi
    
    cd "$app_path"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📥 Installing dependencies for $app_name...${NC}"
        npm install
    fi
    
    # Clean previous builds
    echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
    rm -rf dist out .next build
    
    # Build the application
    echo -e "${YELLOW}🔨 Building $app_name...${NC}"
    eval $build_command
    
    # Check if build was successful
    if [ ! -d "dist" ] && [ ! -d "out" ] && [ ! -d "build" ]; then
        echo -e "${RED}❌ Build failed for $app_name${NC}"
        return 1
    fi
    
    # Create Firebase hosting site if needed
    echo -e "${YELLOW}🔍 Checking Firebase hosting for $hosting_target...${NC}"
    firebase hosting:sites:list 2>/dev/null | grep -q "$hosting_target" || {
        echo -e "${YELLOW}📱 Creating hosting site: $hosting_target${NC}"
        firebase hosting:sites:create $hosting_target || true
    }
    
    # Apply hosting target
    firebase target:apply hosting $hosting_target $hosting_target
    
    # Deploy to Firebase
    echo -e "${YELLOW}☁️  Deploying $app_name to Firebase...${NC}"
    firebase deploy --only hosting:$hosting_target
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $app_name deployed successfully!${NC}"
        echo -e "${GREEN}🔗 Available at: https://$hosting_target.web.app${NC}"
    else
        echo -e "${RED}❌ Deployment failed for $app_name${NC}"
    fi
    
    cd "$BASE_DIR"
}

# Main deployment process
echo ""
echo -e "${YELLOW}🚀 Starting deployment of all NCQ applications...${NC}"

# 1. User Portal
deploy_app "User Portal" \
    "$NCQ_PLATFORM_DIR/user-portal" \
    "ncq-sa" \
    "npm run build"

# 2. Admin Dashboard
deploy_app "Admin Dashboard" \
    "$NCQ_PLATFORM_DIR/admin-dashboard" \
    "ncq-admin" \
    "npm run build"

# 3. Hospital Management
deploy_app "Hospital Management" \
    "$NCQ_PLATFORM_DIR/hospital-management" \
    "ncq-hospital" \
    "npm run build"

# 4. Smart Building (with 3D)
deploy_app "Smart Building" \
    "$NCQ_CO_DIR/smart-building" \
    "ncq-smart-building" \
    "npm run build"

# 5. API Portal
deploy_app "API Portal" \
    "$NCQ_PLATFORM_DIR/api-portal" \
    "ncq-api-portal" \
    "npm run build"

# 6. IoT Platform
deploy_app "IoT Platform" \
    "$NCQ_PLATFORM_DIR/iot-platform" \
    "ncq-iot" \
    "npm run build"

# 7. LLM Platform
deploy_app "LLM Platform" \
    "$NCQ_PLATFORM_DIR/llm-platform" \
    "ncq-llm" \
    "npm run build"

# 8. Payment Gateway
deploy_app "Payment Gateway" \
    "$NCQ_PLATFORM_DIR/payment-gateway" \
    "ncq-payment" \
    "npm run build"

# 9. Payment Admin
deploy_app "Payment Admin" \
    "$NCQ_PLATFORM_DIR/payment-admin" \
    "ncq-payment-admin" \
    "npm run build"

# 10. Payment Merchant
deploy_app "Payment Merchant" \
    "$NCQ_PLATFORM_DIR/payment-merchant" \
    "ncq-payment-merchant" \
    "npm run build"

# 11. Hospitality Staff
deploy_app "Hospitality Staff" \
    "$NCQ_PLATFORM_DIR/hospitality-staff" \
    "ncq-hospitality-staff" \
    "npm run build"

# 12. Smart Hospitality
deploy_app "Smart Hospitality" \
    "$NCQ_PLATFORM_DIR/smart-hospitality" \
    "ncq-hospitality" \
    "npm run build"

# 13. Landing Page
deploy_app "Landing Page" \
    "$NCQ_PLATFORM_DIR/landing-page" \
    "ncq-landing" \
    "npm run build"

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deployment Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📱 Deployed Applications:${NC}"
echo "  • User Portal: https://ncq-sa.web.app"
echo "  • Admin Dashboard: https://ncq-admin.web.app"
echo "  • Hospital Management: https://ncq-hospital.web.app"
echo "  • Smart Building (3D): https://ncq-smart-building.web.app"
echo "  • API Portal: https://ncq-api-portal.web.app"
echo "  • IoT Platform: https://ncq-iot.web.app"
echo "  • LLM Platform: https://ncq-llm.web.app"
echo "  • Payment Gateway: https://ncq-payment.web.app"
echo "  • Payment Admin: https://ncq-payment-admin.web.app"
echo "  • Payment Merchant: https://ncq-payment-merchant.web.app"
echo "  • Hospitality Staff: https://ncq-hospitality-staff.web.app"
echo "  • Smart Hospitality: https://ncq-hospitality.web.app"
echo "  • Landing Page: https://ncq-landing.web.app"
echo ""
echo -e "${GREEN}🎊 All deployments complete!${NC}"
echo ""
echo -e "${YELLOW}📊 View Firebase Console:${NC}"
echo "  https://console.firebase.google.com/project/ncq-sa/hosting/sites"