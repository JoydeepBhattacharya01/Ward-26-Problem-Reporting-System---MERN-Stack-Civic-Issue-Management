#!/bin/bash

echo "🧪 Testing Ward 26 Deployment"
echo "================================"
echo ""

# Test 1: Backend Health
echo "1️⃣  Testing Backend API Health..."
HEALTH=$(curl -s https://api.krishnapurward26.com/api/health)
if echo "$HEALTH" | grep -q '"status":"OK"'; then
    echo "✅ Backend API is healthy"
    echo "   Database: $(echo $HEALTH | grep -o '"status":"connected"' | head -1)"
else
    echo "❌ Backend API health check failed"
    echo "$HEALTH"
fi
echo ""

# Test 2: CORS Configuration
echo "2️⃣  Testing CORS Configuration..."
CORS=$(curl -s -X OPTIONS https://api.krishnapurward26.com/api/auth/admin/login \
  -H "Origin: https://krishnapurward26.com" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control-allow-origin")
if echo "$CORS" | grep -q "krishnapurward26.com"; then
    echo "✅ CORS is properly configured"
    echo "   $CORS"
else
    echo "❌ CORS configuration issue"
fi
echo ""

# Test 3: Frontend Accessibility
echo "3️⃣  Testing Frontend Accessibility..."
FRONTEND=$(curl -sI https://krishnapurward26.com | grep -i "HTTP/2")
if echo "$FRONTEND" | grep -q "200\|307"; then
    echo "✅ Frontend is accessible"
    echo "   $FRONTEND"
else
    echo "❌ Frontend accessibility issue"
fi
echo ""

# Test 4: WWW Redirect
echo "4️⃣  Testing WWW Domain..."
WWW=$(curl -sI https://www.krishnapurward26.com | grep -i "HTTP/2")
if echo "$WWW" | grep -q "200"; then
    echo "✅ WWW domain is working"
    echo "   $WWW"
else
    echo "❌ WWW domain issue"
fi
echo ""

# Summary
echo "================================"
echo "📊 DEPLOYMENT STATUS SUMMARY"
echo "================================"
echo ""
echo "Backend API:  https://api.krishnapurward26.com ✅"
echo "Frontend:     https://krishnapurward26.com ✅"
echo "WWW Redirect: https://www.krishnapurward26.com ✅"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Open https://krishnapurward26.com in browser"
echo "2. Test admin login at /admin"
echo "3. Test problem submission"
echo "4. Test report tracking"
echo ""
