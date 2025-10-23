# 🚨 Backend Deployment Fix Guide - WhatsApp Only

## Issues Found & Fixed

### 1. **CORS Configuration Mismatch** ✅ FIXED
- **Problem**: `render.yaml` had wrong frontend URL
- **Solution**: Updated `FRONTEND_URL` to `https://ward-26-problem-reporting-system-me.vercel.app`

### 2. **Email System Removed** ✅ COMPLETED
- **Problem**: User requested removal of Gmail notifications
- **Solution**: 
  - Removed all email-related environment variables from `render.yaml`
  - Created WhatsApp-only notification system
  - Removed `nodemailer` dependency from `package.json`
  - Kept original email system as backup (`notifications-email-backup.js`)

### 3. **Frontend API Configuration** ✅ FIXED
- **Problem**: Frontend needs to point to production backend
- **Solution**: Created `.env.production` with correct backend URL

## 🔧 Next Steps to Deploy

### Step 1: Update Render Environment Variables
You need to manually update these in your Render dashboard:

1. Go to https://render.com/dashboard
2. Find your `ward26-backend` service
3. Go to **Environment** tab
4. **REMOVE** these email variables if they exist:
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `ADMIN_EMAIL_1`
   - `ADMIN_EMAIL_2`
   - `ADMIN_EMAIL_3`

5. **SET THESE** for WhatsApp notifications:
```
TWILIO_ACCOUNT_SID = [Your Twilio SID - required for WhatsApp]
TWILIO_AUTH_TOKEN = [Your Twilio Token - required for WhatsApp]
TWILIO_WHATSAPP_NUMBER = +14155238886 (Twilio Sandbox number)
TWILIO_PHONE_NUMBER = [Your Twilio SMS number - for fallback]
```

### Step 2: Get Twilio Credentials (Required for WhatsApp)
1. Go to https://console.twilio.com/
2. Sign up for free account if you don't have one
3. Go to Console Dashboard
4. Copy your **Account SID** and **Auth Token**
5. For WhatsApp: Use sandbox number `+14155238886`
6. For SMS fallback: Get a Twilio phone number

### Step 3: Redeploy Backend
1. In Render dashboard, go to your service
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment to complete
4. Check logs for any errors

### Step 4: Update Frontend Environment Variables
In your Vercel dashboard:
1. Go to your frontend project settings
2. Add environment variable:
   ```
   REACT_APP_API_URL = https://ward-26-problem-reporting-system-mern.onrender.com
   ```
3. Redeploy frontend

### Step 5: Test Deployment
After both deployments complete:
1. Visit: https://ward-26-problem-reporting-system-mern.onrender.com/api/health
2. Should return: `{"status":"OK","message":"২৬ নম্বর ওয়ার্ড API চালু আছে"}`
3. Test frontend at: https://ward-26-problem-reporting-system-me.vercel.app/

## 🐛 Common Issues & Solutions

### Backend Still Not Working?
1. **Check Render Logs**:
   - Go to Render dashboard → Your service → Logs
   - Look for MongoDB connection errors
   - Look for missing environment variable errors

2. **MongoDB Connection Issues**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
   - Ensure database user has read/write permissions

3. **Port Issues**:
   - Render automatically assigns PORT
   - Your code correctly uses `process.env.PORT || 8000`

### Frontend Not Connecting?
1. **Check Browser Console**:
   - Look for CORS errors
   - Look for network timeout errors
   - Verify API calls are going to correct URL

2. **Environment Variables**:
   - Ensure `REACT_APP_API_URL` is set in Vercel
   - Redeploy after setting variables

### WhatsApp/SMS Not Working?
1. **Check Twilio Configuration**:
   - Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
   - Check Twilio console for account status and balance
   - Ensure admin phone numbers are in E.164 format (+country code)

2. **WhatsApp Sandbox Setup**:
   - Send "join <sandbox-keyword>" to +14155238886 from admin phones
   - Check Twilio WhatsApp sandbox status in console
   - Verify `TWILIO_WHATSAPP_NUMBER` is set to +14155238886

3. **SMS Fallback**:
   - Ensure you have a Twilio phone number for SMS
   - Set `TWILIO_PHONE_NUMBER` environment variable
   - SMS will be used automatically if WhatsApp fails

## 📞 Quick Test Commands

Test backend health:
```bash
curl https://ward-26-problem-reporting-system-mern.onrender.com/api/health
```

Test CORS:
```bash
curl -H "Origin: https://ward-26-problem-reporting-system-me.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://ward-26-problem-reporting-system-mern.onrender.com/api/health
```

## 🚀 Deployment Status

- ✅ Configuration files updated
- ⏳ Need to update Render environment variables
- ⏳ Need to redeploy backend
- ⏳ Need to update Vercel environment variables  
- ⏳ Need to redeploy frontend

**After completing these steps, your backend should work correctly!**
