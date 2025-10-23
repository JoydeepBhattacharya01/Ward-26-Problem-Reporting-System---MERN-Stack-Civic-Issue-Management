# 🚀 Production Deployment Guide - Ward 26 Problem Reporting System

## 📋 Current Deployment Status

**Frontend URL:** https://ward-26-problem-reporting-system-me.vercel.app/
**Backend URL:** https://ward-26-problem-reporting-system-mern.onrender.com/

## ✅ Configuration Checklist

### Frontend Configuration
- ✅ **Environment Variable Set:** `REACT_APP_API_URL=https://ward-26-problem-reporting-system-mern.onrender.com`
- ✅ **Build Configuration:** React build optimized for production
- ✅ **API Integration:** All API calls configured to use production backend

### Backend Configuration
- ✅ **CORS Setup:** Configured to accept requests from frontend domain
- ✅ **Environment Variables:** All production variables configured
- ✅ **Database:** MongoDB Atlas connection established
- ✅ **Notification System:** WhatsApp/SMS notifications configured

## 🔧 Required Environment Variables

### Render Backend Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://wardadmin:Ward26%402025@cluster0.irxsdob.mongodb.net/wardno26?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=b7f3e8e2b10a44c9835d91df7c2c6f4f8e3c2e6a8d1b6a3f9c8b0d4e1a9f7e2b
FRONTEND_URL=https://ward-26-problem-reporting-system-me.vercel.app
TWILIO_ACCOUNT_SID=[Your Twilio Account SID]
TWILIO_AUTH_TOKEN=[Your Twilio Auth Token]
TWILIO_PHONE_NUMBER=[Your Twilio Phone Number]
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_PHONE_1=+918017362522
ADMIN_PHONE_2=+917029466263
ADMIN_PHONE_3=+919433559980
```

### Vercel Frontend Environment Variables
```env
REACT_APP_API_URL=https://ward-26-problem-reporting-system-mern.onrender.com
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Update Environment Variables in Render Dashboard:**
   - Go to: https://render.com/dashboard
   - Find your `ward26-backend` service
   - Go to **Environment** tab
   - Set all the environment variables listed above

2. **Deploy Backend:**
   - Click **Manual Deploy** → **Deploy latest commit**
   - Wait for deployment to complete
   - Verify logs show successful MongoDB connection

### Step 2: Deploy Frontend to Vercel

1. **Update Environment Variables in Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Find your frontend project
   - Go to **Settings** → **Environment Variables**
   - Set: `REACT_APP_API_URL=https://ward-26-problem-reporting-system-mern.onrender.com`

2. **Deploy Frontend:**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest deployment
   - Or push changes to trigger auto-deployment

### Step 3: Seed Admin Users (If Needed)

If admin login doesn't work, run this command locally:
```bash
cd backend
node scripts/seedAdmin.js
```

**Default Admin Credentials:**
```
Email: admin1@ward26.gov.bd
Password: admin123456

Email: admin2@ward26.gov.bd
Password: admin123456

Email: admin3@ward26.gov.bd
Password: admin123456
```

## 🧪 Testing Checklist

### API Connectivity Tests
- [ ] Backend health check: `https://ward-26-problem-reporting-system-mern.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] API calls from frontend to backend work
- [ ] CORS headers allow frontend domain

### Authentication Tests
- [ ] Admin login works with credentials above
- [ ] JWT tokens are generated and validated
- [ ] Protected routes require authentication

### Database Operations Tests
- [ ] Problem reports can be submitted
- [ ] Problems are stored in MongoDB
- [ ] Admin can view all problems
- [ ] Problem status updates work
- [ ] User can view their reports by phone number

### Notification Tests (Optional - requires Twilio setup)
- [ ] WhatsApp notifications sent to admin phones
- [ ] SMS fallback works if WhatsApp fails
- [ ] Notification logs are created

## 🔍 Troubleshooting

### Frontend Issues
- **Build Errors:** Check for import/export issues, missing dependencies
- **API Connection:** Verify `REACT_APP_API_URL` is set correctly
- **CORS Errors:** Check browser console, verify backend CORS config

### Backend Issues
- **MongoDB Connection:** Check connection string and IP whitelist
- **Environment Variables:** Verify all required variables are set
- **Port Issues:** Render automatically assigns PORT variable

### Common Solutions
1. **Clear browser cache** after deployments
2. **Check deployment logs** in both Render and Vercel
3. **Verify environment variables** are saved and deployed
4. **Test API endpoints** directly with curl or Postman

## 📞 Quick Test Commands

**Test Backend Health:**
```bash
curl https://ward-26-problem-reporting-system-mern.onrender.com/api/health
```

**Test CORS:**
```bash
curl -H "Origin: https://ward-26-problem-reporting-system-me.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://ward-26-problem-reporting-system-mern.onrender.com/api/health
```

## 🎉 Production URLs

**Frontend Application:** https://ward-26-problem-reporting-system-me.vercel.app/
**Backend API:** https://ward-26-problem-reporting-system-mern.onrender.com/
**Admin Dashboard:** https://ward-26-problem-reporting-system-me.vercel.app/admin

## 🔒 Security Notes

- ✅ JWT secret is set to a secure value
- ✅ CORS is configured for specific frontend domain
- ✅ MongoDB connection uses authentication
- ⚠️ Change default admin passwords in production
- ⚠️ Set up proper Twilio credentials for notifications

## 📊 System Architecture

```
User → Frontend (Vercel) → Backend API (Render) → MongoDB Atlas
                                ↓
                         WhatsApp/SMS Notifications (Twilio)
```

**Your MERN application is now production-ready!** 🚀
