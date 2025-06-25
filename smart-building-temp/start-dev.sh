#!/bin/bash

# Smart Hospitality Frontend Development Startup Script

echo "🏨 Starting Smart Hospitality Guest Portal..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt "18" ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Environment file not found. Creating from example..."
    cp .env.example .env.local
fi

echo ""
echo "🚀 Starting development server..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend should be running at: http://localhost:3001"
echo "💳 Payment Gateway should be at: http://localhost:8080"
echo ""
echo "Demo Credentials:"
echo "  Email: demo@smarthotel.com"
echo "  Password: demo123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev