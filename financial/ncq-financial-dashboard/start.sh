#!/bin/bash
cd "$(dirname "$0")"
echo "Starting NCQ Financial Dashboard..."
echo "Opening http://localhost:4000 in your browser..."
npm run dev -- --port 4000 --open