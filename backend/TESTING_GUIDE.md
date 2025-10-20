# 🧪 WhatsApp Notification Testing Guide

## ✅ Sandbox Setup Complete!

Your Twilio WhatsApp sandbox is now active and ready to test!

---

## 📋 Pre-Testing Checklist

### 1. Update Your `.env` File

**CRITICAL:** Update admin phone numbers to India format (+91):

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# Admin Phone Numbers (India format: +91XXXXXXXXXX)
ADMIN_PHONE_1=+919876543210
ADMIN_PHONE_2=+919876543211
ADMIN_PHONE_3=+919876543212

# MongoDB Atlas (if using cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ward26db
```

**Important Notes:**
- ✅ Use `+91` for India (not `+880` for Bangladesh)
- ✅ 10 digits after country code
- ✅ No spaces, dashes, or parentheses
- ✅ Must start with `+`

### 2. Verify All Admins Joined Sandbox

Each admin number must have sent this message to **+14155238886**:
```
join <your-sandbox-code>
```

You should have received confirmation:
```
✅ You are all set! The sandbox can now send/receive messages...
```

### 3. Check MongoDB Connection

Verify your MongoDB is running:
- **Local:** MongoDB running on localhost:27017
- **Atlas:** Connection string is correct in `.env`

---

## 🚀 Testing Methods

### Method 1: Using Example File (Recommended)

```bash
cd backend
node examples/whatsapp-example.js
```

**Edit the file first:**
1. Open `examples/whatsapp-example.js`
2. Uncomment `example3_notifyAllAdmins()` at the bottom
3. Update phone numbers if needed
4. Run the file

**Expected Output:**
```
=== Example 3: Notify All Admins ===
📱 Sending WhatsApp to 3 admin(s)...
WhatsApp sent to +919876543210: SM1234567890abcdef
WhatsApp sent to +919876543211: SM0987654321fedcba
WhatsApp sent to +919876543212: SMabcdef1234567890
WhatsApp notifications: 3 sent, 0 failed
✅ WhatsApp notifications sent to all admins!
```

### Method 2: Via API (Full Integration Test)

**Step 1:** Start the backend server
```bash
cd backend
npm run dev
```

**Step 2:** Login to get JWT token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "your_password"
  }'
```

**Step 3:** Submit a test complaint
```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category": "electricity",
    "subcategory": "বিদ্যুৎ বিভ্রাট",
    "description": "এলাকায় বিদ্যুৎ নেই - টেস্ট নোটিফিকেশন",
    "location": {
      "address": "মিরপুর ১০, ঢাকা",
      "coordinates": {
        "latitude": 23.8069,
        "longitude": 90.3563
      }
    },
    "pollNumber": "POLE-TEST-123"
  }'
```

**Expected Response:**
```json
{
  "message": "সমস্যা সফলভাবে রিপোর্ট করা হয়েছে",
  "problem": { ... }
}
```

**Check Server Logs:**
```
📱 Sending WhatsApp to 3 admin(s)...
WhatsApp sent to +919876543210: SM1234567890abcdef
WhatsApp sent to +919876543211: SM0987654321fedcba
WhatsApp sent to +919876543212: SMabcdef1234567890
WhatsApp notifications: 3 sent, 0 failed
Email notification sent successfully
```

### Method 3: Via Frontend

1. Start the frontend application
2. Login as a regular user
3. Submit a new complaint
4. All admins should receive WhatsApp notification

---

## 📱 What Admins Will Receive

```
🔔 *২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট*

📋 *ক্যাটাগরি:* বিদ্যুৎ সমস্যা
📌 *সাব-ক্যাটাগরি:* বিদ্যুৎ বিভ্রাট
📝 *বিবরণ:* এলাকায় বিদ্যুৎ নেই - টেস্ট নোটিফিকেশন
📍 *অবস্থান:* মিরপুর ১০, ঢাকা
⚡ *খুঁটির নাম্বার:* POLE-TEST-123

👤 *রিপোর্টকারীর তথ্য:*
নাম: Test User
মোবাইল: +919876543210

🕐 *সময়:* ১৯/১০/২০২৫, ১০:৩০:০০ PM
```

---

## 🔍 Verification Checklist

After testing, verify:

- [ ] All configured admins received WhatsApp message
- [ ] Message format is correct with Bengali text
- [ ] Emojis display correctly
- [ ] All complaint details are included
- [ ] Timestamp is correct
- [ ] Console shows success logs
- [ ] No errors in server logs
- [ ] Email notification also sent (if configured)

---

## 🐛 Troubleshooting

### Issue: "Twilio not configured"

**Cause:** Missing Twilio credentials

**Fix:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

### Issue: "WhatsApp number not configured"

**Cause:** Missing WhatsApp number

**Fix:**
```env
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Issue: "No admin phone numbers configured"

**Cause:** All admin phone variables are empty

**Fix:**
```env
ADMIN_PHONE_1=+919876543210
ADMIN_PHONE_2=+919876543211
ADMIN_PHONE_3=+919876543212
```

### Issue: "Invalid phone number format"

**Cause:** Phone number not in E.164 format

**Fix:**
- ✅ Correct: `+919876543210`
- ❌ Wrong: `9876543210` (missing +91)
- ❌ Wrong: `+91 98765 43210` (has spaces)
- ❌ Wrong: `+91-9876543210` (has dash)

**Console Warning:**
```
⚠️  Invalid phone number format: 9876543210 (must be E.164 format, e.g., +919876543210)
⚠️  1 invalid phone number(s) skipped
```

### Issue: "Messages not received"

**Possible Causes:**

1. **Admin didn't join sandbox**
   - Solution: Send "join <code>" to +14155238886

2. **Wrong phone number**
   - Solution: Verify number is correct in `.env`

3. **Twilio account issue**
   - Solution: Check Twilio console for errors
   - URL: https://console.twilio.com/us1/monitor/logs/sms

4. **Rate limiting**
   - Solution: Wait a few minutes and try again

### Issue: "MongoDB connection error"

**Cause:** MongoDB not running or wrong URI

**Fix for Local:**
```bash
# Start MongoDB
mongod
```

**Fix for Atlas:**
```env
# Check connection string format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ward26db?retryWrites=true&w=majority
```

---

## 📊 Monitoring Delivery

### Console Logs

**Success:**
```
📱 Sending WhatsApp to 3 admin(s)...
WhatsApp sent to +919876543210: SM1234567890abcdef
WhatsApp notifications: 3 sent, 0 failed
```

**Partial Failure:**
```
📱 Sending WhatsApp to 3 admin(s)...
WhatsApp sent to +919876543210: SM1234567890abcdef
WhatsApp error for +919876543211: Invalid number
WhatsApp notifications: 2 sent, 1 failed
```

**Complete Failure:**
```
Twilio not configured, skipping WhatsApp
```

### Twilio Console

Monitor real-time delivery at:
https://console.twilio.com/us1/monitor/logs/sms

**Check for:**
- Message SID
- Delivery status
- Error codes
- Timestamps

---

## ✅ Success Criteria

Your WhatsApp notification system is working correctly if:

1. ✅ All admins receive WhatsApp message
2. ✅ Message format is correct
3. ✅ Bengali text displays properly
4. ✅ Console shows success logs
5. ✅ No errors in Twilio console
6. ✅ Delivery happens within 5 seconds
7. ✅ Multiple admins all receive messages
8. ✅ System continues working if one admin fails

---

## 🎯 Next Steps After Successful Testing

### For Continued Sandbox Use:

1. ✅ Keep testing with different complaint types
2. ✅ Test with different admin counts (1, 2, 3)
3. ✅ Test error scenarios (invalid numbers)
4. ✅ Monitor Twilio usage and costs

### For Production Deployment:

1. **Apply for WhatsApp Business API**
   - Through Twilio or Facebook
   - Get your own phone number approved
   - Create message templates

2. **Update Code for Templates**
   - Implement template-based messaging
   - Add template SID management
   - Handle template variables

3. **Add Monitoring**
   - Set up logging service
   - Add delivery tracking
   - Set up alerts for failures

4. **Load Testing**
   - Test with high volume
   - Verify rate limits
   - Check Twilio quotas

---

## 📞 Support Resources

- **Quick Start:** `QUICK_START_WHATSAPP.md`
- **Full Setup:** `WHATSAPP_SETUP.md`
- **Implementation Details:** `WHATSAPP_IMPLEMENTATION_SUMMARY.md`
- **Code Examples:** `examples/whatsapp-example.js`
- **Twilio Docs:** https://www.twilio.com/docs/whatsapp
- **Twilio Console:** https://console.twilio.com

---

## 🎉 Ready to Test!

Your system is now configured and ready for testing. Start with Method 1 (Example File) for the quickest test, then move to Method 2 (API) for full integration testing.

**Good luck!** 🚀
