# 🚀 Render Deployment Configuration Script

## Environment Variables to Set in Render Dashboard

Go to: https://render.com/dashboard → Your `ward26-backend` service → Environment tab

### ✅ SET THESE EXACT VALUES:

```env
NODE_ENV=production

MONGODB_URI=mongodb+srv://wardadmin:Ward26%402025@cluster0.irxsdob.mongodb.net/wardno26?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=b7f3e8e2b10a44c9835d91df7c2c6f4f8e3c2e6a8d1b6a3f9c8b0d4e1a9f7e2b

FRONTEND_URL=https://ward-26-problem-reporting-system-me.vercel.app

TWILIO_ACCOUNT_SID=ACa1f3bd8d39bc0793ebc9b78f21a7f5d9

TWILIO_AUTH_TOKEN=99986986856d6fe076fbb917d0df549f

TWILIO_PHONE_NUMBER=+1234567890

TWILIO_WHATSAPP_NUMBER=+14155238886

ADMIN_PHONE_1=+918017362522

ADMIN_PHONE_2=+917029466263

ADMIN_PHONE_3=+919831546219
```

### ❌ REMOVE THESE VARIABLES (if they exist):
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `ADMIN_EMAIL_1`
- `ADMIN_EMAIL_2`
- `ADMIN_EMAIL_3`

## 🔧 Step-by-Step Instructions:

### Step 1: Update Environment Variables
1. Go to https://render.com/dashboard
2. Click on your `ward26-backend` service
3. Click **Environment** in the left sidebar
4. **Delete** any email-related variables
5. **Add/Update** each variable from the list above
6. Click **Save Changes**

### Step 2: Deploy
1. Click **Manual Deploy** button
2. Select **Deploy latest commit**
3. Wait for deployment to complete (5-10 minutes)

### Step 3: Verify Deployment
1. Check logs for successful MongoDB connection
2. Test health endpoint: https://ward-26-problem-reporting-system-mern.onrender.com/api/health
3. Should return: `{"status":"OK","message":"২৬ নম্বর ওয়ার্ড API চালু আছে"}`

## 📱 WhatsApp Setup (Important!)

### Join Twilio WhatsApp Sandbox:
From each admin phone number, send this message to **+14155238886**:
```
join <sandbox-keyword>
```

**Get the sandbox keyword from:**
1. Go to https://console.twilio.com/
2. Navigate to: Messaging → Try it out → Send a WhatsApp message
3. Copy the join code (e.g., "join <word>")

**Admin phones that need to join:**
- +918017362522
- +917029466263  
- +919831546219

## 🧪 Test Notifications

After deployment, test by:
1. Go to your frontend: https://ward-26-problem-reporting-system-me.vercel.app/
2. Submit a test problem report
3. Check if WhatsApp messages are sent to admin phones
4. If WhatsApp fails, SMS will be used as fallback

## ✅ Expected Results

After successful deployment:
- ✅ Backend responds to health checks
- ✅ MongoDB connection established
- ✅ CORS allows frontend requests
- ✅ WhatsApp notifications sent to admins
- ✅ SMS fallback works if WhatsApp fails
- ✅ Admin dashboard accessible
- ✅ Problem reports stored in database

## 🚨 Troubleshooting

**If deployment fails:**
- Check Render logs for specific errors
- Verify all environment variables are set correctly
- Ensure MongoDB URI is accessible

**If notifications don't work:**
- Verify Twilio credentials are correct
- Check if admin phones joined WhatsApp sandbox
- Look for notification logs in Render console

**Your system will be fully operational after this deployment!** 🎉
