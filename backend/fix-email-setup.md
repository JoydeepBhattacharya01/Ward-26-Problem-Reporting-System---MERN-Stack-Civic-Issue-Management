# Fix Email Notifications - Gmail Setup

## Problem
Email notifications are failing with error: "Username and Password not accepted"

## Root Cause
Gmail requires App Passwords when 2-Factor Authentication is enabled.

## Solution Steps

### Step 1: Enable 2-Factor Authentication (if not already enabled)
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account → Security
2. Click on "2-Step Verification"
3. Scroll down to "App passwords"
4. Click "Generate app password"
5. Select "Mail" as the app
6. Copy the 16-character password (example: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace your current EMAIL_PASSWORD with the app password:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=joydeepbhattacharya668@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Use the app password here (remove spaces)

# Admin Email Addresses
ADMIN_EMAIL_1=joydeepbhattacharya668@gmail.com
ADMIN_EMAIL_2=subhosreebanerjee.dms.154@gmail.com
ADMIN_EMAIL_3=admin3@ward26.gov.bd
```

### Step 4: Test Email Notifications
Run this command to test:
```bash
node diagnose-notifications.js
```

## Alternative: Use Different Email Provider

If Gmail is causing issues, you can use other providers:

### Option 1: Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Option 2: Yahoo Mail
```bash
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

## Current Status
- ✅ WhatsApp notifications are working perfectly
- ❌ Email notifications need the app password fix
- ✅ Problem submission flow is correctly calling notifyAdmins()
