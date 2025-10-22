#!/bin/bash

# Ward 26 Application Startup Script
# Automatically handles port conflicts and starts both frontend and backend

echo "🚀 Ward 26 Problem Reporting System - Startup"
echo "=============================================="
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -ti:$port > /dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔄 Killing process $pid on port $port..."
        kill -9 $pid
        sleep 2
        echo "✅ Port $port is now free"
    fi
}

# Function to find next available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while [ $port -le 3100 ]; do
        if ! check_port $port; then
            echo $port
            return
        fi
        port=$((port + 1))
    done
    
    echo "0"  # No available port found
}

# Check current port status
echo "🔍 Checking port availability..."

FRONTEND_PORT=3000
BACKEND_PORT=8000

if check_port $FRONTEND_PORT; then
    echo "❌ Port $FRONTEND_PORT is in use"
    
    # Ask user what to do
    echo ""
    echo "Options:"
    echo "1. Kill the process and use port 3000"
    echo "2. Use a different port automatically"
    echo "3. Exit and handle manually"
    echo ""
    read -p "Choose option (1/2/3): " choice
    
    case $choice in
        1)
            kill_port $FRONTEND_PORT
            ;;
        2)
            NEW_PORT=$(find_available_port 3001)
            if [ "$NEW_PORT" != "0" ]; then
                FRONTEND_PORT=$NEW_PORT
                echo "✅ Will use port $FRONTEND_PORT for frontend"
            else
                echo "❌ No available ports found"
                exit 1
            fi
            ;;
        3)
            echo "👋 Exiting. Please handle port conflict manually."
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Exiting."
            exit 1
            ;;
    esac
else
    echo "✅ Port $FRONTEND_PORT is available"
fi

if check_port $BACKEND_PORT; then
    echo "❌ Port $BACKEND_PORT is in use"
    NEW_BACKEND_PORT=$(find_available_port 8001)
    if [ "$NEW_BACKEND_PORT" != "0" ]; then
        BACKEND_PORT=$NEW_BACKEND_PORT
        echo "✅ Will use port $BACKEND_PORT for backend"
    else
        echo "❌ No available ports found for backend"
        exit 1
    fi
else
    echo "✅ Port $BACKEND_PORT is available"
fi

# Update configuration files if ports changed
if [ $FRONTEND_PORT -ne 3000 ] || [ $BACKEND_PORT -ne 8000 ]; then
    echo ""
    echo "📝 Updating configuration files..."
    
    # Update frontend package.json
    if [ -f "frontend/package.json" ]; then
        # Create a temporary script to update package.json
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
        if (pkg.scripts && pkg.scripts.start) {
            pkg.scripts.start = 'PORT=$FRONTEND_PORT react-scripts start';
        }
        if (pkg.proxy) {
            pkg.proxy = 'http://localhost:$BACKEND_PORT';
        }
        fs.writeFileSync('frontend/package.json', JSON.stringify(pkg, null, 2));
        console.log('✅ Updated frontend configuration');
        " 2>/dev/null || echo "⚠️  Could not update frontend package.json"
    fi
    
    # Update backend .env
    if [ -f "backend/.env" ]; then
        # Update PORT in .env
        if grep -q "^PORT=" backend/.env; then
            sed -i '' "s/^PORT=.*/PORT=$BACKEND_PORT/" backend/.env
        else
            echo "PORT=$BACKEND_PORT" >> backend/.env
        fi
        
        # Update FRONTEND_URL in .env
        if grep -q "^FRONTEND_URL=" backend/.env; then
            sed -i '' "s|^FRONTEND_URL=.*|FRONTEND_URL=http://localhost:$FRONTEND_PORT|" backend/.env
        else
            echo "FRONTEND_URL=http://localhost:$FRONTEND_PORT" >> backend/.env
        fi
        
        echo "✅ Updated backend .env file"
    fi
fi

echo ""
echo "🚀 Starting Ward 26 Application..."
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend: http://localhost:$BACKEND_PORT"
echo ""

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend

# Set the PORT environment variable and start
PORT=$FRONTEND_PORT npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "📋 To stop the application:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo "or press Ctrl+C in both terminal windows"
echo ""
echo "🌐 Open your browser to: http://localhost:$FRONTEND_PORT"

# Wait for both processes
wait
