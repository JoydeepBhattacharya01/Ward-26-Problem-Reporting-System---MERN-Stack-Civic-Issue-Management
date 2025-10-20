#!/bin/bash

# Ward 26 Problem Reporting System - Setup Script
# This script automates the initial setup process

echo "╔════════════════════════════════════════════════════════╗"
echo "║  ২৬ নম্বর ওয়ার্ড - আমাদের ওয়ার্ড                      ║"
echo "║  Ward 26 Problem Reporting System Setup                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi
print_success "Node.js is installed ($(node -v))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm"
    exit 1
fi
print_success "npm is installed ($(npm -v))"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    print_success "MongoDB is installed"
else
    print_warning "MongoDB not found locally. You can use MongoDB Atlas instead."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Installing Backend Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd backend
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Installing Frontend Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd frontend
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Setting up Environment Variables"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    print_success "Created backend/.env file"
    print_warning "Please edit backend/.env with your configuration"
else
    print_info "backend/.env already exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Creating Uploads Directory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d backend/uploads ]; then
    mkdir -p backend/uploads
    print_success "Created uploads directory"
else
    print_info "Uploads directory already exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "All dependencies installed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Edit backend/.env with your MongoDB URI and other settings"
echo "  2. Start MongoDB (if using local): brew services start mongodb-community"
echo "  3. Seed admin users: cd backend && node scripts/seedAdmin.js"
echo "  4. Start backend: cd backend && npm run dev"
echo "  5. Start frontend: cd frontend && npm start"
echo ""
print_info "Or use the quick commands:"
echo "  npm run server  # Start backend"
echo "  npm run client  # Start frontend"
echo "  npm run dev     # Start both (requires concurrently)"
echo ""
print_info "For detailed instructions, see:"
echo "  - QUICKSTART.md for quick setup"
echo "  - README.md for full documentation"
echo "  - DEPLOYMENT.md for production deployment"
echo ""
echo "\"আমার এলাকা, আমার দায়িত্ব\""
echo ""
