# Ward 26 Notification System - Fix Guide

## 🚨 Issues Identified

Based on the diagnostic analysis, the following critical issues were found:

1. **Gmail Authentication Failures** - Invalid credentials (needs App Password)
2. **Twilio Daily Limits Exceeded** - Account hit 9 messages/day limit
3. **Rate Limiting** - WhatsApp API calls being blocked
4. **Missing Environment Configuration** - Some variables not properly set

## 🔧 Step-by-Step Fix Instructions

### Step 1: Fix Gmail Authentication

#### For Gmail Users:
1. **Enable 2-Factor Authentication**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update Environment Variables**:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  # App Password (no spaces)
   ```

#### Alternative Email Providers:
If Gmail continues to fail, use these alternatives:

**SendGrid** (Recommended):
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
```

**Mailgun**:
```bash
MAILGUN_SMTP_LOGIN=your_mailgun_login
MAILGUN_SMTP_PASSWORD=your_mailgun_password
```

### Step 2: Fix Twilio Issues

#### Upgrade Twilio Account:
1. **Log into Twilio Console**: https://console.twilio.com
2. **Check Account Status**: Verify account is active
3. **Upgrade Account**: Remove daily message limits
4. **Verify Phone Numbers**: Ensure admin phones are verified

#### For WhatsApp Sandbox:
1. **Join WhatsApp Sandbox**: Send "join <sandbox-keyword>" to your Twilio WhatsApp number
2. **Add Admin Numbers**: Register all admin phone numbers in sandbox
3. **Test Connection**: Send a test message from Twilio console

### Step 3: Update Environment Configuration

1. **Copy Environment Template**:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Update Required Variables**:
   ```bash
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_NUMBER=+14155238886

   # Admin Information
   ADMIN_EMAIL_1=admin1@ward26.gov.bd
   ADMIN_EMAIL_2=admin2@ward26.gov.bd
   ADMIN_EMAIL_3=admin3@ward26.gov.bd
   ADMIN_PHONE_1=+919876543210
   ADMIN_PHONE_2=+919876543211
   ADMIN_PHONE_3=+919876543212
   ```

### Step 4: Replace Notification System

1. **Backup Current System**:
   ```bash
   cd backend/utils
   cp notifications.js notifications-backup.js
   ```

2. **Replace with Fixed Version**:
   ```bash
   cp notifications-fixed.js notifications.js
   ```

### Step 5: Test the System

1. **Run Diagnostic Tool**:
   ```bash
   cd backend
   node test-notifications-fixed.js
   ```

2. **Check Results**:
   - ✅ All configuration tests should pass
   - ✅ Live tests should send notifications successfully

### Step 6: Restart Application

```bash
# Stop current server
# Restart backend server
cd backend
npm start

# Restart frontend (if needed)
cd frontend
npm start
```

## 🧪 Testing Notifications

### Manual Test:
1. Submit a new problem report through the frontend
2. Check notification logs: `backend/notification-logs.json`
3. Verify admin emails and phones receive notifications

### Diagnostic Test:
```bash
cd backend
node test-notifications-fixed.js
```

## 📊 Monitoring

### Check Notification Logs:
```bash
tail -f backend/notification-logs.json
```

### Common Success Indicators:
- Email: `"success": true, "messageId": "..."`
- WhatsApp: `"success": true, "sid": "SM..."`
- SMS: `"success": true, "sid": "SM..."`

## 🚨 Troubleshooting

### Gmail Still Failing?
- Verify App Password is correct (16 characters, no spaces)
- Check if account has 2FA enabled
- Try different email provider (SendGrid recommended)

### Twilio Still Failing?
- Check account balance and status
- Verify phone numbers are in E.164 format (+919876543210)
- For WhatsApp: Ensure sandbox is properly configured

### Environment Variables Not Loading?
- Verify `.env` file is in `backend/` directory
- Check file permissions
- Restart server after changes

## 📝 Success Checklist

- [ ] Gmail App Password generated and configured
- [ ] Twilio account upgraded (no daily limits)
- [ ] All environment variables set correctly
- [ ] Notification system replaced with fixed version
- [ ] Diagnostic tests pass
- [ ] Live notifications working
- [ ] Admin emails and phones receiving notifications

## 🆘 Need Help?

If issues persist:
1. Run the diagnostic tool: `node test-notifications-fixed.js`
2. Check the notification logs for specific error messages
3. Verify all environment variables are correctly set
4. Test with alternative email providers if Gmail fails

The enhanced notification system includes:
- ✅ Multiple email provider support
- ✅ Better error handling and retry logic
- ✅ Comprehensive logging
- ✅ Automatic fallbacks (WhatsApp → SMS)
- ✅ Built-in diagnostics
