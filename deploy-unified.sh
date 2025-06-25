#!/bin/bash

# NCQ Platform - Unified Deployment to https://ncq-sa.web.app
# All apps will be available at different paths on the same domain

echo "🚀 NCQ Platform - Unified Deployment"
echo "===================================="
echo "📍 Target: https://ncq-sa.web.app"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create unified dist directory
echo -e "${YELLOW}📁 Creating unified distribution directory...${NC}"
rm -rf dist
mkdir -p dist

# Copy User Portal as the main site
echo -e "${YELLOW}📦 Setting up User Portal as main site...${NC}"
if [ -d "ncq-platform/frontend/user-portal/dist" ]; then
    cp -r ncq-platform/frontend/user-portal/dist/* dist/
    echo -e "${GREEN}✅ User Portal copied${NC}"
else
    echo -e "${RED}❌ User Portal dist not found${NC}"
fi

# Create an enhanced index.html with navigation to all apps
echo -e "${YELLOW}📝 Creating enhanced landing page...${NC}"
cat > dist/index.html << 'EOF'
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 1200px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 1.2em;
        }
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .app-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }
        .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-color: #667eea;
        }
        .app-card h3 {
            font-size: 1.4em;
            margin-bottom: 10px;
            color: #667eea;
        }
        .app-card p {
            color: #666;
            line-height: 1.5;
        }
        .app-card .icon {
            font-size: 2em;
            margin-bottom: 15px;
        }
        .status {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status.live {
            background: #4caf50;
            color: white;
        }
        .status.coming-soon {
            background: #ff9800;
            color: white;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .highlight h3 {
            color: white;
        }
        .highlight p {
            color: rgba(255,255,255,0.9);
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 NCQ Platform</h1>
        <p class="subtitle">Comprehensive Business Solutions Suite</p>
        
        <div class="apps-grid">
            <a href="/" class="app-card">
                <span class="status live">LIVE</span>
                <div class="icon">🏠</div>
                <h3>User Portal</h3>
                <p>Main platform dashboard with access to all services and applications</p>
            </a>
            
            <a href="/smart-building/" class="app-card highlight">
                <span class="status coming-soon">NEW</span>
                <div class="icon">🏢</div>
                <h3>Smart Building 3D</h3>
                <p>Advanced 3D visualization with Babylon.js for intelligent building management</p>
            </a>
            
            <a href="/admin/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">👨‍💼</div>
                <h3>Admin Dashboard</h3>
                <p>Comprehensive administration and system management portal</p>
            </a>
            
            <a href="/hospital/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">🏥</div>
                <h3>Hospital Management</h3>
                <p>Complete healthcare facility management system</p>
            </a>
            
            <a href="/iot/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">📡</div>
                <h3>IoT Platform</h3>
                <p>Device management and monitoring for smart infrastructure</p>
            </a>
            
            <a href="/llm/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">🤖</div>
                <h3>LLM Platform</h3>
                <p>AI-powered language model services and API management</p>
            </a>
            
            <a href="/payment/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">💳</div>
                <h3>Payment Gateway</h3>
                <p>Secure payment processing and financial services</p>
            </a>
            
            <a href="/api-portal/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">🔌</div>
                <h3>API Portal</h3>
                <p>Developer documentation and API management</p>
            </a>
            
            <a href="/hospitality/" class="app-card">
                <span class="status coming-soon">COMING</span>
                <div class="icon">🏨</div>
                <h3>Smart Hospitality</h3>
                <p>Hospitality management for hotels and resorts</p>
            </a>
        </div>
        
        <div class="footer">
            <p>© 2024 NCQ Platform. All rights reserved. | Powered by Firebase</p>
        </div>
    </div>
</body>
</html>
EOF

echo -e "${GREEN}✅ Enhanced landing page created${NC}"

# Create placeholder pages for each app
echo -e "${YELLOW}📄 Creating placeholder pages...${NC}"

# Smart Building placeholder
mkdir -p dist/smart-building
cat > dist/smart-building/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Building 3D - NCQ Platform</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
        }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; }
        .features {
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .features h3 { color: #667eea; margin-bottom: 10px; }
        .features ul { list-style: none; padding: 0; }
        .features li { padding: 5px 0; }
        .features li:before { content: "✨ "; color: #667eea; }
        a {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: transform 0.3s;
        }
        a:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏢 Smart Building 3D</h1>
        <p>Experience the future of building management with our advanced 3D visualization platform.</p>
        
        <div class="features">
            <h3>Features Coming Soon:</h3>
            <ul>
                <li>Interactive 3D building model with Babylon.js</li>
                <li>Real-time IoT device monitoring</li>
                <li>Room-by-room navigation and control</li>
                <li>Energy usage visualization</li>
                <li>Occupancy tracking and analytics</li>
                <li>Smart climate control interface</li>
                <li>Security system integration</li>
            </ul>
        </div>
        
        <p><strong>Status:</strong> The 3D visualization system has been developed and is being prepared for deployment.</p>
        
        <a href="/">← Back to Platform</a>
    </div>
</body>
</html>
EOF

# Create similar placeholders for other apps
apps=("admin" "hospital" "iot" "llm" "payment" "api-portal" "hospitality")
names=("Admin Dashboard" "Hospital Management" "IoT Platform" "LLM Platform" "Payment Gateway" "API Portal" "Smart Hospitality")
icons=("👨‍💼" "🏥" "📡" "🤖" "💳" "🔌" "🏨")

for i in "${!apps[@]}"; do
    mkdir -p "dist/${apps[$i]}"
    cat > "dist/${apps[$i]}/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${names[$i]} - NCQ Platform</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 { color: #333; margin-bottom: 20px; font-size: 2.5em; }
        .icon { font-size: 4em; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; }
        a {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: transform 0.3s;
        }
        a:hover { transform: translateY(-2px); }
        .status {
            background: #ff9800;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            display: inline-block;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">${icons[$i]}</div>
        <h1>${names[$i]}</h1>
        <span class="status">Coming Soon</span>
        <p>This application is currently being prepared for deployment. Check back soon for updates!</p>
        <a href="/">← Back to Platform</a>
    </div>
</body>
</html>
EOF
done

echo -e "${GREEN}✅ All placeholder pages created${NC}"

# Use the unified Firebase configuration
cp firebase-unified.json firebase.json

# Deploy everything to the main domain
echo -e "${YELLOW}🚀 Deploying to https://ncq-sa.web.app...${NC}"
firebase deploy --only hosting

echo ""
echo -e "${GREEN}✅ Unified Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}🌐 All applications are now accessible at:${NC}"
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
echo -e "${YELLOW}📝 Note:${NC}"
echo "All apps currently show placeholder pages. As each app is built,"
echo "its files can be copied to the respective directory in dist/"
echo "and redeployed."