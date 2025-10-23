# 🔒 Secure Deployment Guide - Ward 26 Problem Reporting System

## 🚀 Manual Render Environment Setup

Since GitHub blocks credential commits, you need to manually set these in Render Dashboard.

### Step 1: Go to Render Dashboard
1. Visit: https://render.com/dashboard
2. Click on your `ward26-backend` service
3. Click **Environment** in the left sidebar

### Step 2: Set Environment Variables

**Copy these EXACT values from your .env file:**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://wardadmin:Ward26%402025@cluster0.irxsdob.mongodb.net/wardno26?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=b7f3e8e2b10a44c9835d91df7c2c6f4f8e3c2e6a8d1b6a3f9c8b0d4e1a9f7e2b
FRONTEND_URL=https://ward-26-problem-reporting-system-me.vercel.app
```

**From your .env file, copy these Twilio values:**
- `TWILIO_ACCOUNT_SID` = ACa1f3bd8d39bc0793ebc9b78f21a7f5d9
- `TWILIO_AUTH_TOKEN` = 99986986856d6fe076fbb917d0df549f
- `TWILIO_PHONE_NUMBER` = +1234567890
- `TWILIO_WHATSAPP_NUMBER` = +14155238886

**Admin phone numbers:**
- `ADMIN_PHONE_1` = +918017362522
- `ADMIN_PHONE_2` = +917029466263
- `ADMIN_PHONE_3` = +919831546219

### Step 3: Remove Email Variables
Delete these if they exist:
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASSWORD
- ADMIN_EMAIL_1
- ADMIN_EMAIL_2
- ADMIN_EMAIL_3

### Step 4: Deploy
1. Click **Save Changes**
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment to complete

### Step 5: WhatsApp Setup
From each admin phone, send to +14155238886:
```
join [sandbox-keyword]
```
Get the keyword from Twilio Console → Messaging → WhatsApp sandbox

## ✅ Your System Will Be Fully Operational!

After this setup:
- ✅ WhatsApp notifications will work
- ✅ SMS fallback available
- ✅ All functionality ready for production use
