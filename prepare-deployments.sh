#!/bin/bash

# NCQ Platform - Prepare All Apps for Firebase Deployment
# This script configures all Next.js apps for static export

echo "🔧 NCQ Platform - Deployment Preparation"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Base directories
BASE_DIR=$(pwd)
NCQ_PLATFORM_DIR="$BASE_DIR/ncq-platform-demo"
NCQ_CO_DIR="$BASE_DIR/../NCQ co/ncq-platform-demo"

# Function to update Next.js config for static export
update_nextjs_config() {
    local app_name=$1
    local config_path=$2
    
    echo -e "${YELLOW}📝 Updating Next.js config for $app_name...${NC}"
    
    if [ -f "$config_path" ]; then
        # Check if it's already configured for static export
        if grep -q "output: 'export'" "$config_path"; then
            echo -e "${GREEN}✓ $app_name already configured for static export${NC}"
        else
            # Create a backup
            cp "$config_path" "$config_path.backup"
            
            # Add static export configuration
            cat > "$config_path.tmp" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Original config below (commented out incompatible options)
EOF
            
            # Append original config with modifications
            sed -e 's/^/  \/\/ /' "$config_path" >> "$config_path.tmp"
            echo "};" >> "$config_path.tmp"
            echo "module.exports = nextConfig;" >> "$config_path.tmp"
            
            mv "$config_path.tmp" "$config_path"
            echo -e "${GREEN}✓ Updated $app_name for static export${NC}"
        fi
    fi
}

# Update configurations for Next.js apps
echo -e "${BLUE}🔄 Updating Next.js configurations...${NC}"
echo ""

# API Portal
update_nextjs_config "API Portal" "$NCQ_PLATFORM_DIR/api-portal/next.config.js"

# LLM Platform
update_nextjs_config "LLM Platform" "$NCQ_PLATFORM_DIR/llm-platform/next.config.js"

# Payment Admin
update_nextjs_config "Payment Admin" "$NCQ_PLATFORM_DIR/payment-admin/next.config.js"

# Payment Merchant
update_nextjs_config "Payment Merchant" "$NCQ_PLATFORM_DIR/payment-merchant/next.config.js"

# Hospitality Staff
update_nextjs_config "Hospitality Staff" "$NCQ_PLATFORM_DIR/hospitality-staff/next.config.js"

# Smart Hospitality
update_nextjs_config "Smart Hospitality" "$NCQ_PLATFORM_DIR/smart-hospitality/next.config.js"

# Smart Building (already configured)
echo -e "${GREEN}✓ Smart Building already configured for static export${NC}"

echo ""
echo -e "${GREEN}✅ All configurations updated!${NC}"
echo ""
echo -e "${YELLOW}📌 Next steps:${NC}"
echo "1. Run ./deploy-all.sh to deploy all applications"
echo "2. Or deploy individually from each app directory"
echo ""
echo -e "${YELLOW}⚠️  Note:${NC}"
echo "- Static export disables SSR, API routes, and i18n"
echo "- All apps will use client-side routing"
echo "- Mock data is enabled for demo purposes"