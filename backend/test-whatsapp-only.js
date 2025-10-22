#!/usr/bin/env node

/**
 * WhatsApp-Only Test (without SMS fallback)
 * Tests WhatsApp notifications before purchasing phone number
 */

require('dotenv').config();
const twilio = require('twilio');

const testProblemData = {
  complaintId: 'WHATSAPP-TEST-' + Date.now(),
  category: 'electricity',
  subcategory: 'Power Outage',
  description: 'WhatsApp test notification - please ignore',
  location: {
    address: 'Test Location, Ward 26',
    coordinates: {
      latitude: 22.5726,
      longitude: 88.3639
    }
  },
  userName: 'Test User',
  userPhone: '+919876543210',
  userEmail: 'test@example.com',
  createdAt: new Date()
};

async function testWhatsAppOnly() {
  console.log('📲 WhatsApp-Only Notification Test');
  console.log('==================================\n');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

  if (!accountSid || !authToken) {
    console.log('❌ Missing Twilio credentials');
    return;
  }

  const adminPhones = [
    process.env.ADMIN_PHONE_1,
    process.env.ADMIN_PHONE_2,
    process.env.ADMIN_PHONE_3
  ].filter(phone => phone);

  if (adminPhones.length === 0) {
    console.log('❌ No admin phone numbers configured');
    return;
  }

  console.log(`📱 Testing WhatsApp to ${adminPhones.length} admin(s)...`);
  console.log(`WhatsApp Number: ${whatsappNumber}`);
  console.log('');

  try {
    const client = twilio(accountSid, authToken);

    const whatsappContent = `🔔 *২৬ নম্বর ওয়ার্ড - WhatsApp Test*

📋 *অভিযোগ নম্বর:* ${testProblemData.complaintId}
📋 *ক্যাটাগরি:* বিদ্যুৎ সমস্যা
📝 *বিবরণ:* ${testProblemData.description}
📍 *অবস্থান:* ${testProblemData.location.address}

👤 *রিপোর্টকারীর তথ্য:*
নাম: ${testProblemData.userName}
মোবাইল: ${testProblemData.userPhone}

🕐 *সময়:* ${new Date().toLocaleString('bn-BD')}

⚠️ This is a test message from your new Twilio account!`;

    const results = [];
    
    for (const phone of adminPhones) {
      try {
        console.log(`📤 Sending WhatsApp to ${phone}...`);
        
        const message = await client.messages.create({
          body: whatsappContent,
          from: `whatsapp:${whatsappNumber}`,
          to: `whatsapp:${phone}`
        });

        console.log(`✅ WhatsApp sent successfully!`);
        console.log(`   Message SID: ${message.sid}`);
        console.log(`   Status: ${message.status}`);
        results.push({ phone, success: true, sid: message.sid });
        
      } catch (error) {
        console.log(`❌ WhatsApp failed for ${phone}`);
        console.log(`   Error: ${error.message}`);
        
        if (error.code === 63016) {
          console.log('💡 This phone number is not registered for WhatsApp sandbox');
          console.log(`   Send "join your-keyword" from ${phone} to ${whatsappNumber}`);
        }
        
        results.push({ phone, success: false, error: error.message });
      }
      
      console.log('');
    }

    // Summary
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 WhatsApp Test Results: ${successCount}/${adminPhones.length} successful`);
    
    if (successCount === 0) {
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
      console.log('2. Find your sandbox keyword (e.g., "join abc-def")');
      console.log('3. From each admin phone, send the join message to +14155238886');
      console.log('4. Wait for confirmation, then run this test again');
    } else {
      console.log('\n🎉 WhatsApp is working! Now you can:');
      console.log('1. Purchase a phone number for SMS backup');
      console.log('2. Run full notification tests');
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

if (require.main === module) {
  testWhatsAppOnly().catch(console.error);
}
