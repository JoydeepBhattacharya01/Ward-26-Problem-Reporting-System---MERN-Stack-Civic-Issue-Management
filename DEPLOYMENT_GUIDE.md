# 🚀 Ward 26 Problem Reporting System - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository: `https://github.com/JoydeepBhattacharya01/Ward-26-Problem-Reporting-System---MERN-Stack-Civic-Issue-Management`
- ✅ MongoDB Atlas database ready
- ✅ Render account (for backend)
- ✅ Vercel account (for frontend)
- ✅ Email credentials (Gmail App Password)
- ✅ Twilio credentials (optional, for SMS)

---

## 🎯 Part 1: Backend Deployment on Render

### Step 1: Connect GitHub Repository to Render

1. **Login to Render**: Go to [render.com](https://render.com) and sign in
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repository**: 
   - Connect your GitHub account
   - Select: `JoydeepBhattacharya01/Ward-26-Problem-Reporting-System---MERN-Stack-Civic-Issue-Management`
   - Click "Connect"

### Step 2: Configure Render Service

**Basic Settings:**
- **Name**: `ward26-backend`
- **Region**: `Oregon (US West)` or closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Instance Type**: `Free` (or upgrade as needed)
- **Auto-Deploy**: `Yes`

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://wardadmin:Ward26%402025@cluster0.irxsdob.mongodb.net/wardno26?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long
FRONTEND_URL=https://ward26-problem-reporting.vercel.app
ADMIN_EMAIL_1=joydeepbhattacharya668@gmail.com
ADMIN_EMAIL_2=subhosreebanerjee.dms.154@gmail.com
ADMIN_EMAIL_3=admin3@ward26.gov.bd
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_PHONE_1=+918017362522
ADMIN_PHONE_2=+917029466263
ADMIN_PHONE_3=+919433559980
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://ward26-backend.onrender.com`

### Step 5: Test Backend

Visit: `https://ward26-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "২৬ নম্বর ওয়ার্ড API চালু আছে",
  "timestamp": "2025-10-23T..."
}
```

---

## 🌐 Part 2: Frontend Deployment on Vercel

### Step 1: Connect GitHub Repository to Vercel

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project"
3. **Import Git Repository**: 
   - Select: `JoydeepBhattacharya01/Ward-26-Problem-Reporting-System---MERN-Stack-Civic-Issue-Management`
   - Click "Import"

### Step 2: Configure Vercel Project

**Project Settings:**
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In Vercel dashboard, add this environment variable:

```env
REACT_APP_API_URL=https://ward26-backend.onrender.com
```

**Important**: Replace `ward26-backend` with your actual Render service name if different.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Your frontend will be available at: `https://ward26-problem-reporting.vercel.app`

### Step 5: Update Backend CORS

After frontend deployment, update the `FRONTEND_URL` environment variable in Render:

```env
FRONTEND_URL=https://ward26-problem-reporting.vercel.app
```

**Note**: Replace with your actual Vercel URL if different.

---

## 🔧 Post-Deployment Configuration

### Update Environment Variables

1. **In Render (Backend)**:
   - Update `FRONTEND_URL` with your Vercel URL
   - Ensure all email and SMS credentials are correct

2. **In Vercel (Frontend)**:
   - Verify `REACT_APP_API_URL` points to your Render backend URL

### Test Complete Flow

1. **Visit Frontend**: Go to your Vercel URL
2. **Test Problem Reporting**: 
   - Select a category
   - Fill out the form
   - Submit a test report
3. **Test Admin Dashboard**:
   - Go to `/admin/login`
   - Login with admin credentials
   - Verify reports appear
4. **Test User Reports**:
   - Use "View Report Status" feature
   - Enter phone number from test report
   - Verify report appears with correct status

---

## 🔒 Security Checklist

- ✅ MongoDB Atlas IP whitelist configured
- ✅ Strong JWT secret (32+ characters)
- ✅ Gmail App Password (not regular password)
- ✅ Environment variables secured
- ✅ HTTPS enabled (automatic with Render/Vercel)
- ✅ CORS properly configured

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- **Logs**: Check Render dashboard for backend logs
- **Metrics**: Monitor CPU, memory usage
- **Health Check**: `https://your-backend-url.onrender.com/api/health`

### Vercel Monitoring
- **Analytics**: Enable Vercel Analytics
- **Performance**: Monitor Core Web Vitals
- **Deployments**: Track deployment history

---

## 🚨 Troubleshooting

### Common Issues

**Backend Issues:**
- **MongoDB Connection**: Verify connection string and IP whitelist
- **Environment Variables**: Check all required variables are set
- **Build Errors**: Check Render build logs

**Frontend Issues:**
- **API Calls Failing**: Verify `REACT_APP_API_URL` is correct
- **CORS Errors**: Ensure backend `FRONTEND_URL` matches Vercel URL
- **Build Errors**: Check Vercel build logs

**Integration Issues:**
- **404 Errors**: Check API endpoint URLs
- **Authentication Issues**: Verify JWT secret consistency
- **File Upload Issues**: Ensure backend handles multipart/form-data

### Debug Commands

**Check API Connectivity:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

**Test Problem Creation:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/problems \
  -H "Content-Type: application/json" \
  -d '{"category":"others","subcategory":"Test","description":"Test","location":"{\"address\":\"Test\"}","userName":"Test","userPhone":"01234567890"}'
```

---

## 🎉 Deployment Complete!

Your Ward 26 Problem Reporting System is now live:

- **Frontend**: `https://ward26-problem-reporting.vercel.app`
- **Backend**: `https://ward26-backend.onrender.com`
- **Admin Dashboard**: `https://ward26-problem-reporting.vercel.app/admin/login`

### Default Admin Credentials
- **Email**: `joydeepbhattacharya668@gmail.com`
- **Password**: Use the password from your admin seeding script

---

## 📞 Support

For deployment issues:
- **Developer**: Joydeep Bhattacharya
- **Email**: joydeepbhattacharya668@gmail.com
- **GitHub**: https://github.com/JoydeepBhattacharya01

---

**"আমার এলাকা, আমার দায়িত্ব"** - Your Area, Your Responsibility

*Deployment Guide v1.0 - October 2025*
