#!/bin/bash
echo "Starting NCQ Financial Dashboard..."
echo "Killing any existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1
echo "Starting development server..."
npm run dev -- --host 0.0.0.0