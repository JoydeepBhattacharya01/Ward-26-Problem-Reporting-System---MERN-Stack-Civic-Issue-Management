# 🚀 Deployment Verification Checklist

## After Render + Vercel Redeployment

### ✅ Step 1: Test Backend API
```bash
curl https://api.krishnapurward26.com/api/health
```
**Expected:** `"status":"OK"` and `"database":{"status":"connected"}`

---

### ✅ Step 2: Test CORS
```bash
curl -X OPTIONS https://api.krishnapurward26.com/api/auth/admin/login \
  -H "Origin: https://krishnapurward26.com" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control"
```
**Expected:** Should see `access-control-allow-origin: https://krishnapurward26.com`

---

### ✅ Step 3: Test Frontend Loading
1. Open: https://krishnapurward26.com
2. Open DevTools → Console
3. Look for: `API_BASE_URL: https://api.krishnapurward26.com`
4. Check for errors (should be none)

---

### ✅ Step 4: Test Admin Login
1. Go to: https://krishnapurward26.com/admin
2. Login with:
   - Email: `joydeepbhattacharya668@gmail.com`
   - Password: `admin123456` (default) or your custom password
3. Should successfully login and see dashboard

**If login fails:**
- Open DevTools → Network tab
- Try login again
- Check the request URL (should be `https://api.krishnapurward26.com/api/auth/admin/login`)
- Check response for error details

---

### ✅ Step 5: Test Problem Submission
1. Go to: https://krishnapurward26.com/categories
2. Select any category (e.g., "Infrastructure")
3. Fill out problem report form:
   - Name: Test User
   - Phone: +919999999999
   - Description: Test problem
   - Upload image (optional)
4. Submit
5. Should see success message

**If submission fails:**
- Check Network tab for failed request
- Verify request goes to `https://api.krishnapurward26.com/api/problems`

---

### ✅ Step 6: Test Report Tracking
1. Go to: https://krishnapurward26.com/user-reports
2. Enter phone number: +919999999999 (or the one you used)
3. Click "খুঁজুন" (Search)
4. Should see your test report

**If search fails:**
- Check Network tab
- Verify request goes to `https://api.krishnapurward26.com/api/problems/user/+919999999999`

---

### ✅ Step 7: Test Admin Dashboard Features
1. Login to admin dashboard
2. Check if problems list loads
3. Try updating a problem status
4. Check if statistics show correctly

---

## 🔍 Common Issues & Quick Fixes

### Issue: "Network Error" or "Failed to fetch"
**Cause:** Frontend still using old API URL
**Fix:** 
1. Verify Vercel environment variable is set
2. Redeploy from Vercel dashboard
3. Hard refresh browser (Cmd+Shift+R)

### Issue: CORS Error
**Cause:** Backend FRONTEND_URL doesn't match
**Fix:**
1. Check Render environment: `FRONTEND_URL=https://krishnapurward26.com`
2. Redeploy backend
3. Wait 2-3 minutes

### Issue: Admin Login Returns 401
**Cause:** Wrong credentials or admin not seeded
**Fix:**
1. Check backend logs on Render
2. Default credentials: `admin1@ward26.gov.bd` / `admin123456`
3. Or use your configured admin email

### Issue: Database Connection Failed
**Cause:** MongoDB URI issue
**Fix:**
1. Check Render logs for MongoDB errors
2. Verify MongoDB Atlas allows Render IPs (0.0.0.0/0)
3. Check MongoDB URI is correct

---

## 📊 Success Criteria

All these should work:
- ✅ API health check returns OK
- ✅ CORS headers present
- ✅ Frontend loads without console errors
- ✅ Admin can login
- ✅ Users can submit problems
- ✅ Users can track reports by phone
- ✅ Admin can view and update problems

---

## 🎯 Performance Checks

### Frontend Performance
```bash
# Check frontend load time
curl -w "@-" -o /dev/null -s https://krishnapurward26.com <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### Backend Performance
```bash
# Check API response time
curl -w "@-" -o /dev/null -s https://api.krishnapurward26.com/api/health <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

**Expected:** Total time < 500ms for both

---

## 📱 Mobile Testing

Test on mobile devices:
1. Open https://krishnapurward26.com on phone
2. Test problem submission
3. Test report tracking
4. Check responsive design

---

## 🔔 Optional: Notification Testing

If you configured email/SMS:

### Test Email Notifications
1. Submit a problem
2. Check admin email for notification
3. Update problem status
4. Check user receives resolution email

### Test SMS Notifications
1. Submit a problem with valid phone
2. Admin should receive SMS
3. Update to resolved
4. User should receive SMS

**Note:** Requires valid EMAIL_USER, EMAIL_PASSWORD, and Twilio credentials

---

## 📝 Post-Deployment Tasks

- [ ] Update DNS TTL back to normal (if you lowered it)
- [ ] Set up uptime monitoring (UptimeRobot, Better Uptime)
- [ ] Configure error tracking (Sentry, LogRocket)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Create backup strategy for MongoDB
- [ ] Document admin procedures
- [ ] Train admin users

---

## 🆘 Emergency Rollback

If everything breaks:

### Rollback Frontend
1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

### Rollback Backend
1. Go to Render → Deployments
2. Find previous working deployment
3. Click "..." → Redeploy

### Revert Environment Variables
1. Change `FRONTEND_URL` back to old Vercel URL
2. Change `REACT_APP_API_URL` back to old Render URL
3. Redeploy both services

---

## 📞 Support Contacts

- **Developer:** Joydeep Bhattacharya
- **Email:** joydeepbhattacharya668@gmail.com
- **GitHub:** https://github.com/JoydeepBhattacharya01/Ward-26-Problem-Reporting-System---MERN-Stack-Civic-Issue-Management

---

**Last Updated:** October 24, 2025
**Deployment Status:** In Progress
