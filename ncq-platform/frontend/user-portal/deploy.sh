#!/bin/bash

# NCQ Platform Deployment Script
# Usage: ./deploy.sh [vercel|netlify|docker]

set -e

echo "🚀 NCQ Platform Deployment Script"
echo "================================"

# Check if build exists
if [ ! -d "dist" ]; then
    echo "📦 Building application..."
    npm run build
fi

case "$1" in
    "vercel")
        echo "📤 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
        
    "netlify")
        echo "📤 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
        
    "docker")
        echo "🐳 Building Docker image..."
        docker build -t ncq-platform .
        echo "✅ Docker image built successfully!"
        echo "Run with: docker run -p 8080:80 ncq-platform"
        ;;
        
    *)
        echo "Usage: ./deploy.sh [vercel|netlify|docker]"
        echo ""
        echo "Available options:"
        echo "  vercel  - Deploy to Vercel"
        echo "  netlify - Deploy to Netlify"  
        echo "  docker  - Build Docker image"
        exit 1
        ;;
esac

echo "✅ Deployment complete!"