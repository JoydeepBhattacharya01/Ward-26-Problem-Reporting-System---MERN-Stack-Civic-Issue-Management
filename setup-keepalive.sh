#!/bin/bash

# Keep-Alive Setup Script for Ward 26 Problem Reporting System
# This script helps you set up a cron job to keep your backend awake

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Ward 26 Keep-Alive Setup                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="https://ward-26-problem-reporting-system-mern.onrender.com"
HEALTH_ENDPOINT="${BACKEND_URL}/api/health"

echo -e "${BLUE}Testing backend health endpoint...${NC}"
echo ""

# Test the health endpoint
response=$(curl -s -w "\n%{http_code}" "$HEALTH_ENDPOINT")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
    echo ""
    echo "Response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
else
    echo -e "${RED}❌ Backend health check failed (HTTP $http_code)${NC}"
    echo ""
    echo "Response:"
    echo "$body"
    echo ""
    echo -e "${YELLOW}Please check if your backend is running on Render.${NC}"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Setup Options:${NC}"
echo ""
echo "1. ${GREEN}cron-job.org${NC} (Recommended - Free & Easy)"
echo "   - Visit: https://cron-job.org"
echo "   - Create account (free)"
echo "   - Add cron job:"
echo "     • URL: $HEALTH_ENDPOINT"
echo "     • Interval: Every 5 minutes (*/5 * * * *)"
echo "     • Method: GET"
echo ""
echo "2. ${GREEN}UptimeRobot${NC} (Free Tier)"
echo "   - Visit: https://uptimerobot.com"
echo "   - Add HTTP(s) monitor"
echo "   - URL: $HEALTH_ENDPOINT"
echo "   - Interval: 5 minutes"
echo ""
echo "3. ${GREEN}Better Uptime${NC} (Free Tier)"
echo "   - Visit: https://betteruptime.com"
echo "   - Create monitor"
echo "   - URL: $HEALTH_ENDPOINT"
echo "   - Interval: 3 minutes"
echo ""
echo "4. ${GREEN}Self-Hosted${NC} (If you have a 24/7 server)"
echo "   - Run: cd backend && npm run keep-alive"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}Would you like to test the keep-alive script locally? (y/n)${NC}"
read -r answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo ""
    echo -e "${BLUE}Starting keep-alive test (will ping once)...${NC}"
    echo ""
    cd backend
    export BACKEND_URL="$BACKEND_URL"
    node -e "
    const { pingBackend } = require('./keep-alive.js');
    pingBackend().then(() => {
        console.log('\n✅ Keep-alive test completed successfully!');
        console.log('You can now set up a cron service to run this automatically.');
        process.exit(0);
    }).catch(err => {
        console.error('\n❌ Keep-alive test failed:', err.message);
        process.exit(1);
    });
    "
else
    echo ""
    echo -e "${GREEN}Setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Choose a cron service from the options above"
    echo "2. Set up a cron job to ping: $HEALTH_ENDPOINT"
    echo "3. Set interval to 5 minutes"
    echo "4. Monitor your backend to ensure it stays awake"
    echo ""
    echo "For detailed instructions, see: KEEP_ALIVE_SETUP.md"
fi

echo ""
echo -e "${GREEN}Done!${NC}"
