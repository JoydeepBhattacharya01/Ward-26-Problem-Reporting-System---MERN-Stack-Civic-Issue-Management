# WhatsApp Notification Setup Guide

## Overview
This application now uses Twilio's WhatsApp API to send notifications to admins whenever a user submits a complaint or message.

## Prerequisites

1. **Twilio Account**: Sign up at [https://www.twilio.com](https://www.twilio.com)
2. **WhatsApp Sandbox** (for testing) or **Approved WhatsApp Business Account** (for production)

## Setup Instructions

### 1. Get Twilio Credentials

1. Log in to your Twilio Console
2. Find your **Account SID** and **Auth Token** from the dashboard
3. Copy these values

### 2. Configure WhatsApp Sandbox (Testing)

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to join the sandbox by sending a message from your WhatsApp to the Twilio sandbox number
3. The sandbox number is typically: `+14155238886` (US) or check your console
4. Send the join code (e.g., "join <your-code>") from each admin's WhatsApp number

### 3. Configure Environment Variables

Update your `.env` file with the following:

```env
# Twilio Configuration (WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# Admin Phone Numbers (must be in E.164 format)
ADMIN_PHONE_1=+8801712345678
ADMIN_PHONE_2=+8801812345678
ADMIN_PHONE_3=+8801912345678
```

**Important Notes:**
- Phone numbers must be in E.164 format: `+[country code][number]`
- For Bangladesh: `+880` followed by the 10-digit number (without leading 0)
- Example: `01712345678` becomes `+8801712345678`

### 4. Production Setup (Optional)

For production use with your own WhatsApp Business number:

1. Apply for WhatsApp Business API access through Twilio
2. Get your number approved by WhatsApp
3. Update `TWILIO_WHATSAPP_NUMBER` with your approved number

## Usage

### Automatic Notifications

The system automatically sends WhatsApp notifications when:
- A user submits a new problem report
- The notification is sent to all configured admin phone numbers

### Manual Usage

You can also use the helper function directly in your code:

```javascript
const { sendWhatsApp } = require('./utils/notifications');

// Send to a single number
try {
  const result = await sendWhatsApp('+8801712345678', 'Your message here');
  console.log('Message sent:', result);
} catch (error) {
  console.error('Failed to send:', error);
}

// Send to multiple admins
const { sendWhatsAppNotification } = require('./utils/notifications');

const problemData = {
  category: 'electricity',
  subcategory: 'Power Outage',
  description: 'No electricity in the area',
  location: { address: 'Dhaka, Bangladesh' },
  userName: 'John Doe',
  userPhone: '+8801712345678',
  createdAt: new Date()
};

await sendWhatsAppNotification(problemData);
```

## Message Format

WhatsApp messages are formatted with:
- 🔔 Notification header
- 📋 Category and subcategory
- 📝 Description
- 📍 Location
- 👤 Reporter information
- 🕐 Timestamp

Messages support WhatsApp markdown formatting:
- `*bold text*` for bold
- `_italic text_` for italic
- Emojis for visual appeal

## Testing

### Test the Integration

1. Ensure all admin numbers have joined the WhatsApp sandbox
2. Create a test problem report through the API
3. Check that all admins receive the WhatsApp notification

### Example Test Request

```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category": "electricity",
    "subcategory": "Power Outage",
    "description": "Test notification",
    "location": {
      "address": "Test Location",
      "coordinates": [90.4125, 23.8103]
    }
  }'
```

## Troubleshooting

### Common Issues

1. **"Twilio not configured"**
   - Check that `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set correctly

2. **"WhatsApp number not configured"**
   - Verify `TWILIO_WHATSAPP_NUMBER` is set in your `.env` file

3. **"No admin phone numbers configured"**
   - Ensure at least one `ADMIN_PHONE_X` variable is set

4. **Messages not received**
   - Verify admin numbers have joined the WhatsApp sandbox
   - Check phone number format (must be E.164: +8801XXXXXXXXX)
   - Review Twilio console logs for delivery status

5. **"Unverified number" error**
   - In sandbox mode, all recipient numbers must join the sandbox first
   - For production, use an approved WhatsApp Business number

### Check Logs

The application logs WhatsApp delivery status:
```
WhatsApp sent to +8801712345678: SM1234567890abcdef
WhatsApp notifications: 3 sent, 0 failed
```

## API Reference

### Functions Available

#### `sendWhatsAppNotification(problemData)`
Sends WhatsApp notification to all configured admin numbers.

**Parameters:**
- `problemData`: Object containing problem details

**Returns:** `Promise<boolean>` - true if at least one message sent successfully

#### `sendWhatsApp(to, message)`
Sends a WhatsApp message to a specific number.

**Parameters:**
- `to`: Phone number in E.164 format (e.g., '+8801712345678')
- `message`: Message content (supports WhatsApp markdown)

**Returns:** `Promise<Object>` - Result object with success status and message SID

#### `notifyAdmins(problemData)`
Sends both email and WhatsApp notifications to admins.

**Parameters:**
- `problemData`: Object containing problem details

**Returns:** `Promise<Object>` - Object with email and whatsapp status

## Cost Considerations

- **Sandbox**: Free for testing
- **Production**: Check Twilio's WhatsApp pricing
- **Message Rates**: Varies by country
- **Session Messages**: Free within 24-hour window after user message

## Security Best Practices

1. Never commit `.env` file to version control
2. Use environment variables for all sensitive data
3. Rotate Twilio credentials periodically
4. Monitor usage in Twilio console
5. Set up usage alerts to prevent unexpected charges

## Support

For issues with:
- **Twilio/WhatsApp**: [Twilio Support](https://support.twilio.com)
- **Application**: Check application logs and console output
- **Integration**: Review this documentation and test with sandbox first
