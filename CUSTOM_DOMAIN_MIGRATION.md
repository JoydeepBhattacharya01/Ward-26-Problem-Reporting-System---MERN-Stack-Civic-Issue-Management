# Custom Domain Migration Checklist
## Migrating from Render URL to Custom Domain

**Old API URL:** `https://ward-26-problem-reporting-system-mern.onrender.com`  
**New API URL:** `https://api.krishnapurward26.com`

---

## ✅ FRONTEND CHANGES (COMPLETED)

### 1. Environment Variables
- **File:** `frontend/.env.production`
- **Change:** Updated `REACT_APP_API_URL` to new custom domain
- **Status:** ✅ DONE

```env
REACT_APP_API_URL=https://api.krishnapurward26.com
```

### 2. API Configuration
- **File:** `frontend/src/config/api.js`
- **Status:** ✅ NO CHANGES NEEDED
- **Reason:** Uses `process.env.REACT_APP_API_URL` dynamically
- All API endpoints are built from this base URL

---

## 🔧 BACKEND CHANGES (REQUIRED)

### 1. Update CORS Configuration
**File:** Backend `.env` on Render dashboard

**Required Change:**
```env
FRONTEND_URL=https://ward-26-problem-reporting-system-me.vercel.app
```

**Action Steps:**
1. Go to Render Dashboard → Your Backend Service
2. Navigate to "Environment" tab
3. Update `FRONTEND_URL` variable to match your frontend domain
4. Click "Save Changes"
5. Render will automatically redeploy

**Why:** The backend CORS is configured to only accept requests from `FRONTEND_URL`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Rebuild Frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel
```bash
# If using Vercel CLI
vercel --prod

# Or push to GitHub (if auto-deploy is enabled)
git add .
git commit -m "Update API URL to custom domain"
git push origin main
```

### Step 3: Update Backend Environment Variable
1. Login to Render Dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` if needed
5. Save (auto-redeploys)

---

## ✅ VERIFICATION CHECKLIST

### 1. Test API Health Endpoint
```bash
curl https://api.krishnapurward26.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "২৬ নম্বর ওয়ার্ড API চালু আছে",
  "timestamp": "2025-01-24T...",
  "uptime": 123.45,
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

### 2. Test CORS from Frontend
Open browser console on your frontend and check:
```javascript
// Should see successful API calls
console.log('API_BASE_URL:', process.env.REACT_APP_API_URL);
```

### 3. Test Problem Submission
- Navigate to Categories page
- Select a category
- Submit a test problem report
- Check if submission succeeds

### 4. Test User Reports Lookup
- Go to "Track Your Reports" page
- Enter a phone number
- Verify reports load correctly

### 5. Test Admin Dashboard
- Login to admin dashboard
- Check if problems list loads
- Try updating a problem status
- Verify notifications work

### 6. Check Browser Network Tab
- Open DevTools → Network tab
- Look for API calls
- Verify all calls go to `https://api.krishnapurward26.com`
- Check for CORS errors (should be none)

---

## 🔍 TROUBLESHOOTING

### Issue: CORS Errors
**Symptoms:**
```
Access to XMLHttpRequest at 'https://api.krishnapurward26.com/api/problems' 
from origin 'https://ward-26-problem-reporting-system-me.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
1. Check backend `FRONTEND_URL` environment variable
2. Ensure it matches your exact frontend domain
3. Redeploy backend after changing

### Issue: Old URL Still Being Used
**Symptoms:** API calls still going to old Render URL

**Solution:**
```bash
# Clear build cache
cd frontend
rm -rf build node_modules/.cache

# Rebuild
npm install
npm run build

# Redeploy
vercel --prod
```

### Issue: 404 Not Found
**Symptoms:** API returns 404 for all endpoints

**Solution:**
1. Verify DNS is properly configured
2. Check GoDaddy CNAME/A records point to Render
3. Wait for DNS propagation (up to 48 hours)
4. Test with `nslookup api.krishnapurward26.com`

### Issue: SSL Certificate Errors
**Symptoms:** `NET::ERR_CERT_AUTHORITY_INVALID`

**Solution:**
1. Verify SSL certificate is active on Render
2. Check custom domain SSL status in Render dashboard
3. May need to wait for certificate provisioning

---

## 📋 FILES THAT REFERENCE API URL

### Files Updated:
- ✅ `frontend/.env.production` - Main environment config

### Files That Use It (No changes needed):
- ✅ `frontend/src/config/api.js` - Uses env variable
- ✅ `frontend/src/context/AuthContext.js` - Uses API_ENDPOINTS
- ✅ `frontend/src/pages/AdminDashboard.js` - Uses API_ENDPOINTS
- ✅ `frontend/src/pages/ReportProblemPage.js` - Uses API_ENDPOINTS
- ✅ `frontend/src/pages/UserReportsPage.js` - Uses API_ENDPOINTS
- ✅ `frontend/src/pages/MyReportsPage.js` - Uses API_ENDPOINTS

**All API calls use the centralized configuration from `api.js`**

---

## 🎯 BEST PRACTICES

### 1. Cache Clearing
After deployment, users may need to clear cache:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache completely
- Consider adding cache-busting headers

### 2. Environment-Specific URLs
Keep separate configs for different environments:
- `.env.development` → `http://localhost:8000`
- `.env.production` → `https://api.krishnapurward26.com`

### 3. Monitoring
Set up monitoring for:
- API uptime (use UptimeRobot or similar)
- CORS errors in frontend logs
- Failed API requests
- Response times

### 4. Rollback Plan
If issues occur:
1. Revert `.env.production` to old URL
2. Rebuild and redeploy frontend
3. Old Render URL should still work

---

## 📊 SUMMARY

**Changes Required:**
1. ✅ Frontend `.env.production` - UPDATED
2. ⏳ Backend `FRONTEND_URL` env var - UPDATE ON RENDER
3. ⏳ Rebuild and redeploy frontend
4. ⏳ Test all functionality

**No Code Changes Needed:**
- All API calls already use environment variables
- Centralized configuration in `api.js`
- Automatic retry logic will handle any temporary issues

**Estimated Time:** 10-15 minutes
**DNS Propagation:** Up to 48 hours (usually faster)

---

## 🆘 SUPPORT

If you encounter issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify DNS with `nslookup api.krishnapurward26.com`
4. Test API directly with curl/Postman
5. Check CORS configuration matches exactly
