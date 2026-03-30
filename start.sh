#!/bin/bash
# SupportIQ — Start Script
# NexGen Support

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         SupportIQ — Startup              ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Backend
echo "→ Starting FastAPI backend on port 8000..."
cd backend
pip install -r requirements.txt -q
python main.py &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# Wait for backend
sleep 2

# Frontend
echo ""
echo "→ Starting React frontend on port 5173..."
cd ../frontend
npm install -q
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ SupportIQ is running!"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  API:       http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "  Demo login: demo@supportiq.ai / demo1234"
echo ""
echo "Press Ctrl+C to stop all services."

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
