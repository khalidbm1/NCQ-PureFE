#!/bin/bash

echo "🚀 Starting NCQ Platform Comprehensive Demo..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing demo dependencies..."
    npm install
fi

# Install dependencies for all applications
echo "📦 Installing dependencies for all applications..."
echo "This may take a few minutes on first run..."

npm run install-all

echo ""
echo "🎪 Starting all demo applications..."
echo "======================================"
echo ""
echo "Applications will be available at:"
echo "• Landing Page (Demo Launcher): http://localhost:3000"
echo "• Admin Dashboard: http://localhost:3001"
echo "• User Portal: http://localhost:3002"
echo "• Hospital Management: http://localhost:3003"
echo "• Payment Gateway: http://localhost:3004"
echo "• Smart Hospitality: http://localhost:3005"
echo "• IoT Platform: http://localhost:3006"
echo "• AI/LLM Platform: http://localhost:3007"
echo "• API Portal: http://localhost:3008"
echo ""
echo "🔐 Demo Credentials:"
echo "Username: admin@ncq.sa"
echo "Password: NCQDemo2024!"
echo "API Key: ncq_demo_key_123"
echo ""
echo "💡 Tip: Start with the Landing Page at http://localhost:3000"
echo "         It contains links to launch all other applications"
echo ""
echo "Press Ctrl+C to stop all applications"
echo ""

# Start all applications
npm run demo