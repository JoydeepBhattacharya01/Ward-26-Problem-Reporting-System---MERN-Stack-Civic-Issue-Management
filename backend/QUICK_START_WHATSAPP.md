# Quick Start: WhatsApp Notifications

## 🚀 5-Minute Setup

### Step 1: Update `.env` file

```env
# Add these to your .env file
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# Admin phone numbers (E.164 format: +country_code + number)
ADMIN_PHONE_1=+8801712345678
ADMIN_PHONE_2=+8801812345678
ADMIN_PHONE_3=+8801912345678
```

### Step 2: Join WhatsApp Sandbox

From each admin's WhatsApp, send this message to `+14155238886`:

```
join <your-sandbox-code>
```

You'll find your sandbox code in the [Twilio Console](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn).

### Step 3: Test It!

The system is already integrated! When a user submits a problem report, all admins will automatically receive a WhatsApp notification.

## 📱 What Happens Now?

### Automatic Notifications

Every time a user submits a complaint through the app:

1. ✅ Email sent to all admins
2. ✅ WhatsApp message sent to all admins
3. ✅ Both happen automatically in the background

### Message Format

Admins receive a formatted WhatsApp message like:

```
🔔 ২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট

📋 ক্যাটাগরি: বিদ্যুৎ সমস্যা
📌 সাব-ক্যাটাগরি: বিদ্যুৎ বিভ্রাট
📝 বিবরণ: এলাকায় বিদ্যুৎ নেই
📍 অবস্থান: মিরপুর ১০, ঢাকা

👤 রিপোর্টকারীর তথ্য:
নাম: মোঃ রহিম
মোবাইল: +8801712345678

🕐 সময়: ১৯/১০/২০২৫, ৯:৩০:০০ PM
```

## 🔧 Manual Usage (Optional)

If you want to send custom WhatsApp messages:

```javascript
const { sendWhatsApp } = require('./utils/notifications');

// Send to one admin
await sendWhatsApp('+8801712345678', 'Your custom message');

// Send to multiple admins
const admins = ['+8801712345678', '+8801812345678'];
for (const admin of admins) {
  await sendWhatsApp(admin, 'Your message');
}
```

## ✅ Verify Setup

Run this test to verify everything works:

```bash
cd backend
node examples/whatsapp-example.js
```

Uncomment `example3_notifyAllAdmins()` in the file to test.

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| No messages received | Ensure admin numbers joined the sandbox |
| "Not configured" error | Check `.env` file has all Twilio variables |
| Wrong format error | Phone numbers must be in E.164 format: `+8801XXXXXXXXX` |
| Sandbox expired | Re-join by sending "join <code>" again |

## 📊 Monitor Delivery

Check the console logs:

```
WhatsApp sent to +8801712345678: SM1234567890abcdef
WhatsApp notifications: 3 sent, 0 failed
```

Or view in [Twilio Console](https://console.twilio.com/us1/monitor/logs/sms) → Monitor → Logs → Messaging

## 🎯 Key Features

✅ **Automatic**: Triggers on every new complaint  
✅ **Multi-admin**: Sends to all configured admins  
✅ **Formatted**: Beautiful Bengali text with emojis  
✅ **Reliable**: Error handling and logging built-in  
✅ **Flexible**: Helper function for custom messages  

## 📚 More Information

- Full setup guide: `WHATSAPP_SETUP.md`
- Code examples: `examples/whatsapp-example.js`
- Twilio docs: https://www.twilio.com/docs/whatsapp

## 🔐 Security Notes

- Never commit `.env` to Git
- Rotate credentials regularly
- Monitor usage in Twilio console
- Set up billing alerts

---

**That's it!** Your WhatsApp notifications are ready to use. 🎉
