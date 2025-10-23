#!/bin/bash

# Ward 26 Problem Reporting System - Production Deployment Script
# Author: Joydeep Bhattacharya
# Version: 1.0.0

echo "🚀 Starting Ward 26 Problem Reporting System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_header "=== Ward 26 Problem Reporting System Deployment ==="

# Step 1: Install Backend Dependencies
print_status "Installing backend dependencies..."
cd backend
if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

npm install --production
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi

print_status "Backend dependencies installed successfully ✅"

# Step 2: Install Frontend Dependencies and Build
print_status "Installing frontend dependencies..."
cd ../frontend
if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi

print_status "Frontend dependencies installed successfully ✅"

# Step 3: Build Frontend for Production
print_status "Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi

print_status "Frontend built successfully ✅"

# Step 4: Check Environment Configuration
cd ../backend
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please create one based on .env.example"
    print_status "Copying .env.example to .env..."
    cp .env.example .env
    print_warning "Please update the .env file with your production values before starting the server."
fi

# Step 5: Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Step 6: Display deployment summary
print_header "=== Deployment Summary ==="
print_status "✅ Backend dependencies installed"
print_status "✅ Frontend dependencies installed"
print_status "✅ Frontend production build created"
print_status "✅ Environment configuration checked"
print_status "✅ Logs directory created"

print_header "=== Next Steps ==="
echo "1. Update your .env file with production values"
echo "2. Ensure your MongoDB Atlas connection is configured"
echo "3. Update FRONTEND_URL in .env to your production domain"
echo "4. Start the production server with: npm start"

print_header "=== Production Server Commands ==="
echo "• Start server: cd backend && npm start"
echo "• View logs: tail -f backend/logs/app.log"
echo "• Frontend build location: frontend/build/"

print_status "🎉 Deployment preparation completed successfully!"
print_warning "Remember to update your .env file before starting the production server."
