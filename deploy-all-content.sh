#!/bin/bash

# NCQ Platform - Build and Deploy All Applications with Content
# This script builds each application and deploys it to the unified hosting

echo "🚀 NCQ Platform - Full Content Deployment"
echo "========================================"
echo "📍 Target: https://ncq-sa.web.app"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Base paths
NCQ_DEMO_PATH="../NCQ co/ncq-platform-demo"
DIST_PATH="dist"

# Create unified dist directory
echo -e "${YELLOW}📁 Creating unified distribution directory...${NC}"
rm -rf $DIST_PATH
mkdir -p $DIST_PATH

# Function to build Next.js apps with static export
build_nextjs_app() {
    local app_name=$1
    local app_path=$2
    local dist_target=$3
    
    echo -e "${YELLOW}🔨 Building $app_name...${NC}"
    
    if [ -d "$app_path" ]; then
        cd "$app_path"
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📦 Installing dependencies for $app_name...${NC}"
            npm install --legacy-peer-deps
        fi
        
        # Update next.config for static export
        if [ -f "next.config.js" ]; then
            # Backup original
            cp next.config.js next.config.js.bak
            
            # Create static export config
            cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.BASE_PATH || '',
}

module.exports = nextConfig
EOF
        fi
        
        # Build with base path
        BASE_PATH="/$dist_target" npm run build
        
        # Copy to dist
        if [ -d "out" ]; then
            mkdir -p "../../../NCQ pure FE/$DIST_PATH/$dist_target"
            cp -r out/* "../../../NCQ pure FE/$DIST_PATH/$dist_target/"
            echo -e "${GREEN}✅ $app_name built and copied${NC}"
        else
            echo -e "${RED}❌ $app_name build failed - no out directory${NC}"
        fi
        
        # Restore original config
        if [ -f "next.config.js.bak" ]; then
            mv next.config.js.bak next.config.js
        fi
        
        cd - > /dev/null
    else
        echo -e "${RED}❌ $app_name path not found: $app_path${NC}"
    fi
}

# Function to build Vite/React apps
build_vite_app() {
    local app_name=$1
    local app_path=$2
    local dist_target=$3
    
    echo -e "${YELLOW}🔨 Building $app_name...${NC}"
    
    if [ -d "$app_path" ]; then
        cd "$app_path"
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📦 Installing dependencies for $app_name...${NC}"
            npm install --legacy-peer-deps
        fi
        
        # Update vite.config for base path
        if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
            # Build with base path
            npm run build -- --base=/$dist_target/
        else
            npm run build
        fi
        
        # Copy to dist
        if [ -d "dist" ]; then
            mkdir -p "../../../NCQ pure FE/$DIST_PATH/$dist_target"
            cp -r dist/* "../../../NCQ pure FE/$DIST_PATH/$dist_target/"
            echo -e "${GREEN}✅ $app_name built and copied${NC}"
        elif [ -d "build" ]; then
            mkdir -p "../../../NCQ pure FE/$DIST_PATH/$dist_target"
            cp -r build/* "../../../NCQ pure FE/$DIST_PATH/$dist_target/"
            echo -e "${GREEN}✅ $app_name built and copied${NC}"
        else
            echo -e "${RED}❌ $app_name build failed - no dist/build directory${NC}"
        fi
        
        cd - > /dev/null
    else
        echo -e "${RED}❌ $app_name path not found: $app_path${NC}"
    fi
}

# 1. Copy User Portal as main site (already built)
echo -e "${YELLOW}📦 Setting up User Portal as main site...${NC}"
if [ -d "ncq-platform/frontend/user-portal/dist" ]; then
    cp -r ncq-platform/frontend/user-portal/dist/* $DIST_PATH/
    echo -e "${GREEN}✅ User Portal copied${NC}"
else
    echo -e "${RED}❌ User Portal dist not found${NC}"
fi

# 2. Build Smart Building with 3D
echo -e "${BLUE}🏢 Processing Smart Building...${NC}"
cd "$NCQ_DEMO_PATH/smart-building"

# Fix package.json for smart building
cat > package.json << 'EOF'
{
  "name": "smart-building",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "@babylonjs/core": "^6.0.0",
    "@babylonjs/loaders": "^6.0.0",
    "@headlessui/react": "^1.7.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-select": "^1.0.0",
    "@radix-ui/react-slider": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "axios": "^1.0.0",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.200.0",
    "next": "14.0.0",
    "postcss": "^8.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
EOF

# Install and build
npm install --legacy-peer-deps
cd "../../../NCQ pure FE"
build_nextjs_app "Smart Building" "$NCQ_DEMO_PATH/smart-building" "smart-building"

# 3. Build Admin Dashboard
build_vite_app "Admin Dashboard" "$NCQ_DEMO_PATH/admin-dashboard" "admin"

# 4. Build Hospital Management
build_vite_app "Hospital Management" "$NCQ_DEMO_PATH/hospital-management" "hospital"

# 5. Build IoT Platform
build_vite_app "IoT Platform" "$NCQ_DEMO_PATH/iot-platform" "iot"

# 6. Build LLM Platform
build_nextjs_app "LLM Platform" "$NCQ_DEMO_PATH/llm-platform" "llm"

# 7. Build Payment Gateway
build_vite_app "Payment Gateway" "$NCQ_DEMO_PATH/payment-gateway" "payment"

# 8. Build API Portal
build_nextjs_app "API Portal" "$NCQ_DEMO_PATH/api-portal" "api-portal"

# 9. Build Smart Hospitality
build_nextjs_app "Smart Hospitality" "$NCQ_DEMO_PATH/smart-hospitality" "hospitality"

# Create an enhanced index.html with status updates
echo -e "${YELLOW}📝 Updating landing page with build status...${NC}"
cat > $DIST_PATH/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCQ Platform - Unified Portal</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 3em;
        }
        .subtitle {
            color: #666;
            font-size: 1.3em;
        }
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
        }
        .app-card {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 35px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 250px;
        }
        .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        .app-card h3 {
            font-size: 1.6em;
            margin-bottom: 15px;
            color: #667eea;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .app-card .icon {
            font-size: 1.5em;
        }
        .app-card p {
            color: #666;
            line-height: 1.6;
            flex-grow: 1;
        }
        .app-card .features {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #888;
        }
        .status {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status.live {
            background: #4caf50;
            color: white;
        }
        .status.building {
            background: #2196f3;
            color: white;
        }
        .status.error {
            background: #f44336;
            color: white;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .highlight h3, .highlight p, .highlight .features {
            color: white;
        }
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            padding: 20px;
        }
        .tech-stack {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        .tech {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        .highlight .tech {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 NCQ Platform</h1>
            <p class="subtitle">Comprehensive Business Solutions Suite</p>
        </div>
        
        <div class="apps-grid">
            <a href="/" class="app-card">
                <span class="status live">LIVE</span>
                <h3><span class="icon">🏠</span> User Portal</h3>
                <p>Central hub for accessing all NCQ platform services with unified authentication and dashboard.</p>
                <div class="tech-stack">
                    <span class="tech">React</span>
                    <span class="tech">TypeScript</span>
                    <span class="tech">Tailwind</span>
                </div>
            </a>
            
            <a href="/smart-building/" class="app-card highlight">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">🏢</span> Smart Building 3D</h3>
                <p>Advanced 3D visualization for intelligent building management with real-time IoT monitoring.</p>
                <div class="features">
                    ✨ Babylon.js 3D engine • 🎮 Interactive controls • 📊 Real-time data
                </div>
                <div class="tech-stack">
                    <span class="tech">Next.js</span>
                    <span class="tech">Babylon.js</span>
                    <span class="tech">WebGL</span>
                </div>
            </a>
            
            <a href="/admin/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">👨‍💼</span> Admin Dashboard</h3>
                <p>Comprehensive administration portal for system management, user control, and analytics.</p>
                <div class="tech-stack">
                    <span class="tech">React</span>
                    <span class="tech">Vite</span>
                    <span class="tech">Redux</span>
                </div>
            </a>
            
            <a href="/hospital/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">🏥</span> Hospital Management</h3>
                <p>Complete healthcare facility management with patient records, appointments, and billing.</p>
                <div class="tech-stack">
                    <span class="tech">React</span>
                    <span class="tech">Material-UI</span>
                    <span class="tech">Charts.js</span>
                </div>
            </a>
            
            <a href="/iot/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">📡</span> IoT Platform</h3>
                <p>Device management and monitoring platform for smart infrastructure and sensors.</p>
                <div class="tech-stack">
                    <span class="tech">React</span>
                    <span class="tech">WebSocket</span>
                    <span class="tech">MQTT</span>
                </div>
            </a>
            
            <a href="/llm/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">🤖</span> LLM Platform</h3>
                <p>AI-powered language model services with API management and fine-tuning capabilities.</p>
                <div class="tech-stack">
                    <span class="tech">Next.js</span>
                    <span class="tech">OpenAI</span>
                    <span class="tech">Stripe</span>
                </div>
            </a>
            
            <a href="/payment/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">💳</span> Payment Gateway</h3>
                <p>Secure payment processing with support for multiple payment methods and currencies.</p>
                <div class="tech-stack">
                    <span class="tech">React</span>
                    <span class="tech">Stripe</span>
                    <span class="tech">PCI DSS</span>
                </div>
            </a>
            
            <a href="/api-portal/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">🔌</span> API Portal</h3>
                <p>Developer documentation, API testing, and SDK management for all platform services.</p>
                <div class="tech-stack">
                    <span class="tech">Next.js</span>
                    <span class="tech">Swagger</span>
                    <span class="tech">GraphQL</span>
                </div>
            </a>
            
            <a href="/hospitality/" class="app-card">
                <span class="status building">BUILDING</span>
                <h3><span class="icon">🏨</span> Smart Hospitality</h3>
                <p>Modern hospitality management for hotels with booking, guest services, and automation.</p>
                <div class="tech-stack">
                    <span class="tech">Next.js</span>
                    <span class="tech">Framer Motion</span>
                    <span class="tech">Prisma</span>
                </div>
            </a>
        </div>
        
        <div class="footer">
            <p>© 2024 NCQ Platform. All rights reserved. | Powered by Firebase</p>
            <p style="margin-top: 10px; opacity: 0.8;">🚀 Building the future of business solutions</p>
        </div>
    </div>
</body>
</html>
EOF

echo -e "${GREEN}✅ Landing page updated${NC}"

# Deploy everything
echo -e "${YELLOW}🚀 Deploying all content to Firebase...${NC}"
firebase deploy --only hosting

echo ""
echo -e "${GREEN}✅ Full Content Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo ""

# Check what was successfully built
for dir in $DIST_PATH/*/; do
    if [ -d "$dir" ]; then
        app_name=$(basename "$dir")
        echo -e "  ${GREEN}✅${NC} $app_name"
    fi
done

echo ""
echo -e "${BLUE}🌐 Access your applications at:${NC}"
echo ""
echo "  📱 Main Portal: https://ncq-sa.web.app"
echo "  🏢 Smart Building: https://ncq-sa.web.app/smart-building/"
echo "  👨‍💼 Admin: https://ncq-sa.web.app/admin/"
echo "  🏥 Hospital: https://ncq-sa.web.app/hospital/"
echo "  📡 IoT: https://ncq-sa.web.app/iot/"
echo "  🤖 LLM: https://ncq-sa.web.app/llm/"
echo "  💳 Payment: https://ncq-sa.web.app/payment/"
echo "  🔌 API Portal: https://ncq-sa.web.app/api-portal/"
echo "  🏨 Hospitality: https://ncq-sa.web.app/hospitality/"
echo ""