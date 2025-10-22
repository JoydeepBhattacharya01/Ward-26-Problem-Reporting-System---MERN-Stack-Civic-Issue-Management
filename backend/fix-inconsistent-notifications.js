#!/usr/bin/env node

/**
 * Fix for Inconsistent Notifications
 * Implements robust notification handling with fallbacks and rate limit management
 */

require('dotenv').config();

console.log('🔧 Fixing Inconsistent Notifications');
console.log('====================================');

console.log('\n🔍 Root Cause Analysis:');
console.log('=======================');
console.log('✅ Pattern Identified: Twilio Daily Message Limits');
console.log('✅ WhatsApp works initially, then hits 9 message/day limit');
console.log('✅ Email consistently fails due to Gmail authentication');
console.log('✅ No retry logic for failed notifications');

console.log('\n💡 Solutions to Implement:');
console.log('==========================');
console.log('1. 🔄 Add retry logic with exponential backoff');
console.log('2. 📱 Implement SMS fallback when WhatsApp fails');
console.log('3. 📧 Fix email authentication (Gmail App Password)');
console.log('4. ⏰ Add rate limit detection and handling');
console.log('5. 📊 Add notification status logging');
console.log('6. 🔀 Implement notification queue system');

console.log('\n🚀 Implementation Plan:');
console.log('=======================');

// Check current Twilio account status
async function checkTwilioStatus() {
  console.log('\n📱 Checking Twilio Account Status...');
  
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Get account info
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log(`Account Status: ${account.status}`);
    console.log(`Account Type: ${account.type}`);
    
    // Check message usage (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const messages = await client.messages.list({
      dateSentAfter: thirtyDaysAgo,
      limit: 100
    });
    
    console.log(`Messages sent in last 30 days: ${messages.length}`);
    
    // Check today's messages
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayMessages = messages.filter(msg => new Date(msg.dateSent) >= todayStart);
    
    console.log(`Messages sent today: ${todayMessages.length}`);
    
    if (todayMessages.length >= 9) {
      console.log('⚠️  WARNING: Approaching or exceeded daily limit (9 messages/day for trial)');
      console.log('💡 Solution: Upgrade to paid Twilio account for higher limits');
    }
    
    return {
      status: account.status,
      type: account.type,
      totalMessages: messages.length,
      todayMessages: todayMessages.length,
      nearLimit: todayMessages.length >= 8
    };
    
  } catch (error) {
    console.error('❌ Error checking Twilio status:', error.message);
    return null;
  }
}

// Generate improved notification system
function generateImprovedNotifications() {
  console.log('\n📝 Generating Improved Notification System...');
  
  const improvedCode = `
// Enhanced notification system with retry logic and fallbacks
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      console.log(\`Attempt \${attempt} failed: \${error.message}\`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Enhanced WhatsApp notification with rate limit handling
exports.sendWhatsAppNotificationEnhanced = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client || !process.env.TWILIO_WHATSAPP_NUMBER) {
      console.log('WhatsApp not configured, trying SMS fallback...');
      return await exports.sendAdminSMS(problemData);
    }

    // Get admin phone numbers
    const adminPhones = [
      process.env.ADMIN_PHONE_1,
      process.env.ADMIN_PHONE_2,
      process.env.ADMIN_PHONE_3
    ].filter(phone => phone && isValidE164(phone));

    if (adminPhones.length === 0) {
      console.log('No valid admin phone numbers');
      return false;
    }

    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    // Create message content (same as before)
    let gpsLocationText = '';
    if (problemData.location.coordinates && 
        problemData.location.coordinates.latitude && 
        problemData.location.coordinates.longitude) {
      const lat = problemData.location.coordinates.latitude;
      const lng = problemData.location.coordinates.longitude;
      const googleMapsUrl = \`https://www.google.com/maps?q=\${lat},\${lng}\`;
      gpsLocationText = \`\\n🌍 *GPS স্থানাঙ্ক:* \${lat.toFixed(6)}, \${lng.toFixed(6)}\\n📱 *Google Maps:* \${googleMapsUrl}\`;
    }

    const whatsappContent = \`🔔 *২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট*

📋 *ক্যাটাগরি:* \${categoryBengali}
📌 *সাব-ক্যাটাগরি:* \${problemData.subcategory}
📝 *বিবরণ:* \${problemData.description}
📍 *অবস্থান:* \${problemData.location.address}\${gpsLocationText}\${problemData.pollNumber ? \`\\n⚡ *খুঁটির নাম্বার:* \${problemData.pollNumber}\` : ''}\${problemData.festivalDate ? \`\\n📅 *তারিখ:* \${new Date(problemData.festivalDate).toLocaleDateString('bn-BD')}\` : ''}

👤 *রিপোর্টকারীর তথ্য:*
নাম: \${problemData.userName}
মোবাইল: \${problemData.userPhone}\${problemData.userEmail ? \`\\nইমেইল: \${problemData.userEmail}\` : ''}

🕐 *সময়:* \${new Date(problemData.createdAt).toLocaleString('bn-BD')}\`;

    // Send with retry logic
    const results = [];
    for (const phone of adminPhones) {
      const sendToPhone = async () => {
        try {
          const result = await client.messages.create({
            body: whatsappContent,
            from: \`whatsapp:\${process.env.TWILIO_WHATSAPP_NUMBER}\`,
            to: \`whatsapp:\${phone}\`
          });
          console.log(\`✅ WhatsApp sent to \${phone}: \${result.sid}\`);
          return { success: true, phone, sid: result.sid };
        } catch (error) {
          // Check for rate limit error
          if (error.message.includes('exceeded') || error.message.includes('limit')) {
            console.log(\`⚠️  Rate limit hit for \${phone}, trying SMS fallback...\`);
            // Try SMS fallback for this specific admin
            return await sendSMSToAdmin(phone, problemData);
          }
          throw error;
        }
      };
      
      try {
        const result = await retryWithBackoff(sendToPhone);
        results.push(result);
      } catch (error) {
        console.error(\`❌ Failed to send to \${phone} after retries: \${error.message}\`);
        results.push({ success: false, phone, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(\`WhatsApp/SMS notifications: \${successCount} sent, \${results.length - successCount} failed\`);
    
    return successCount > 0;
  } catch (error) {
    console.error('Enhanced WhatsApp notification error:', error);
    // Fallback to SMS for all admins
    console.log('Falling back to SMS for all admins...');
    return await exports.sendAdminSMS(problemData);
  }
};

// SMS fallback for individual admin
async function sendSMSToAdmin(phone, problemData) {
  try {
    const client = createTwilioClient();
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      return { success: false, phone, error: 'SMS not configured' };
    }
    
    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    let smsGpsText = '';
    if (problemData.location.coordinates && 
        problemData.location.coordinates.latitude && 
        problemData.location.coordinates.longitude) {
      const lat = problemData.location.coordinates.latitude;
      const lng = problemData.location.coordinates.longitude;
      const googleMapsUrl = \`https://www.google.com/maps?q=\${lat},\${lng}\`;
      smsGpsText = \`\\nGPS: \${lat.toFixed(4)}, \${lng.toFixed(4)}\\nMaps: \${googleMapsUrl}\`;
    }
    
    const smsContent = \`🔔 New Complaint - Ward 26
ID: \${problemData.complaintId}
Category: \${categoryBengali}
Location: \${problemData.location.address}\${smsGpsText}
Reporter: \${problemData.userName} (\${problemData.userPhone})
Time: \${new Date(problemData.createdAt).toLocaleString()}\`;

    const message = await client.messages.create({
      body: smsContent,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log(\`✅ SMS fallback sent to \${phone}: \${message.sid}\`);
    return { success: true, phone, sid: message.sid, method: 'SMS' };
  } catch (error) {
    console.error(\`❌ SMS fallback failed for \${phone}: \${error.message}\`);
    return { success: false, phone, error: error.message };
  }
}

// Enhanced notifyAdmins with better error handling
exports.notifyAdminsEnhanced = async (problemData) => {
  console.log('🔔 Sending enhanced notifications to admins...');
  
  const results = {
    email: false,
    whatsapp: false,
    sms: false,
    timestamp: new Date().toISOString(),
    attempts: []
  };
  
  // Try email with retry
  try {
    console.log('📧 Attempting email notification...');
    results.email = await retryWithBackoff(() => exports.sendEmailNotification(problemData));
    results.attempts.push({ method: 'email', success: results.email });
  } catch (emailError) {
    console.error('📧 Email notification failed after retries:', emailError.message);
    results.attempts.push({ method: 'email', success: false, error: emailError.message });
  }
  
  // Try enhanced WhatsApp/SMS
  try {
    console.log('📱 Attempting WhatsApp/SMS notification...');
    const whatsappResult = await exports.sendWhatsAppNotificationEnhanced(problemData);
    results.whatsapp = whatsappResult;
    results.attempts.push({ method: 'whatsapp_enhanced', success: whatsappResult });
  } catch (whatsappError) {
    console.error('📱 WhatsApp/SMS notification failed:', whatsappError.message);
    results.attempts.push({ method: 'whatsapp_enhanced', success: false, error: whatsappError.message });
  }
  
  // Log notification results
  const successCount = results.attempts.filter(a => a.success).length;
  console.log(\`📊 Notification summary: \${successCount}/\${results.attempts.length} methods successful\`);
  
  // Save notification log
  try {
    const fs = require('fs');
    const logEntry = {
      timestamp: results.timestamp,
      complaintId: problemData.complaintId,
      results: results,
      success: successCount > 0
    };
    
    const logFile = 'notification-logs.json';
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (logError) {
    console.error('Failed to save notification log:', logError.message);
  }
  
  return results;
};
`;

  console.log('✅ Enhanced notification system code generated');
  console.log('📁 Ready to implement in utils/notifications.js');
  
  return improvedCode;
}

// Main execution
async function main() {
  const twilioStatus = await checkTwilioStatus();
  const improvedCode = generateImprovedNotifications();
  
  console.log('\n📋 Action Items:');
  console.log('================');
  
  if (twilioStatus && twilioStatus.nearLimit) {
    console.log('🔴 URGENT: Upgrade Twilio account to paid plan');
    console.log('   - Trial accounts limited to 9 messages/day');
    console.log('   - Paid accounts have much higher limits');
    console.log('   - Cost: ~$20/month for basic plan');
  }
  
  console.log('🔧 IMMEDIATE FIXES:');
  console.log('1. Fix Gmail email authentication (App Password)');
  console.log('2. Implement retry logic with exponential backoff');
  console.log('3. Add SMS fallback when WhatsApp fails');
  console.log('4. Add notification logging for monitoring');
  
  console.log('\n🎯 EXPECTED RESULTS:');
  console.log('====================');
  console.log('✅ 95%+ notification success rate');
  console.log('✅ Automatic fallback to SMS when WhatsApp fails');
  console.log('✅ Retry logic handles temporary failures');
  console.log('✅ Detailed logging for troubleshooting');
  console.log('✅ Graceful handling of rate limits');
  
  console.log('\n💡 NEXT STEPS:');
  console.log('===============');
  console.log('1. Update .env with Gmail App Password');
  console.log('2. Replace notification functions with enhanced versions');
  console.log('3. Test the improved system');
  console.log('4. Monitor notification logs');
  console.log('5. Consider upgrading Twilio to paid plan');
}

if (require.main === module) {
  main().catch(console.error);
}
