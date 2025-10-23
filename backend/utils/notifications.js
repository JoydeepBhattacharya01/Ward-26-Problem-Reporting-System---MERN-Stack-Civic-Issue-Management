const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

// WhatsApp-only notification system for Ward 26
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Twilio client setup
const createTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      return client;
    } catch (error) {
      console.error('Twilio client creation failed:', error.message);
      return null;
    }
  }
  console.log('Twilio not configured - WhatsApp/SMS notifications disabled');
  return null;
};

// Category names in Bengali
const categoryNames = {
  electricity: 'বিদ্যুৎ সমস্যা',
  drainage: 'নর্দমা সমস্যা',
  road: 'রাস্তাঘাট সমস্যা',
  festival: 'উৎসব',
  medical_emergency: 'চিকিৎসা জরুরি অবস্থা',
  other: 'অন্যান্য',
  // New comprehensive categories
  infrastructure_public_works: 'অবকাঠামো ও গণপূর্ত',
  waste_management_sanitation: 'বর্জ্য ব্যবস্থাপনা ও স্যানিটেশন',
  parks_public_spaces: 'পার্ক ও পাবলিক স্পেস',
  water_sanitation_services: 'পানি ও স্যানিটেশন সেবা',
  electricity_power: 'বিদ্যুৎ ও পাওয়ার',
  public_transport_traffic: 'পাবলিক ট্রান্সপোর্ট ও ট্রাফিক',
  housing_community_facilities: 'হাউজিং ও কমিউনিটি সুবিধা',
  safety_law_enforcement: 'নিরাপত্তা ও আইন প্রয়োগ',
  education_social_services: 'শিক্ষা ও সামাজিক সেবা'
};

// Validate phone number in E.164 format
const isValidE164 = (phone) => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Enhanced logging
function logNotification(type, success, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    success,
    ...details
  };
  
  try {
    const logFile = path.join(__dirname, '..', 'notification-logs.json');
    let logs = [];
    
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(content);
    }
    
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to log notification:', error.message);
  }
}

// Test Twilio configuration
async function testTwilioConfiguration() {
  try {
    const client = createTwilioClient();
    if (!client) {
      return { success: false, error: 'Twilio not configured' };
    }

    // Test account access
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    return { 
      success: true, 
      message: 'Twilio configuration is valid',
      accountStatus: account.status,
      accountType: account.type
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      smsGpsText = `\nGPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}\nMaps: ${googleMapsUrl}`;
    }
    
    const smsContent = `🔔 New Complaint - Ward 26
ID: ${problemData.complaintId}
Category: ${categoryBengali}
Location: ${problemData.location.address}${smsGpsText}
Reporter: ${problemData.userName} (${problemData.userPhone})
Time: ${new Date(problemData.createdAt).toLocaleString()}`;

    const message = await client.messages.create({
      body: smsContent,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log(`✅ SMS sent to ${phone}: ${message.sid}`);
    logNotification('sms_fallback', true, { phone, sid: message.sid });
    return { success: true, phone, sid: message.sid, method: 'SMS' };
  } catch (error) {
    console.error(`❌ SMS failed for ${phone}: ${error.message}`);
    logNotification('sms_fallback', false, { phone, error: error.message });
    return { success: false, phone, error: error.message };
  }
}

// WhatsApp notification with SMS fallback
exports.sendWhatsAppNotification = async (problemData) => {
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

    console.log(`📱 Sending WhatsApp to ${adminPhones.length} admin(s)...`);

    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    // Create GPS location text if available
    let gpsLocationText = '';
    if (problemData.location.coordinates && 
        problemData.location.coordinates.latitude && 
        problemData.location.coordinates.longitude) {
      const lat = problemData.location.coordinates.latitude;
      const lng = problemData.location.coordinates.longitude;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      gpsLocationText = `\n🌍 *GPS স্থানাঙ্ক:* ${lat.toFixed(6)}, ${lng.toFixed(6)}\n📱 *Google Maps:* ${googleMapsUrl}`;
    }

    const whatsappContent = `🔔 *২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট*

📋 *অভিযোগ নম্বর:* ${problemData.complaintId}
📋 *ক্যাটাগরি:* ${categoryBengali}
📌 *সাব-ক্যাটাগরি:* ${problemData.subcategory}
📝 *বিবরণ:* ${problemData.description}
📍 *অবস্থান:* ${problemData.location.address}${gpsLocationText}${problemData.pollNumber ? `\n⚡ *খুঁটির নাম্বার:* ${problemData.pollNumber}` : ''}${problemData.festivalDate ? `\n📅 *তারিখ:* ${new Date(problemData.festivalDate).toLocaleDateString('bn-BD')}` : ''}

👤 *রিপোর্টকারীর তথ্য:*
নাম: ${problemData.userName}
মোবাইল: ${problemData.userPhone}${problemData.userEmail ? `\nইমেইল: ${problemData.userEmail}` : ''}

🕐 *সময়:* ${new Date(problemData.createdAt).toLocaleString('bn-BD')}`;

    // Send with retry logic and fallback
    const results = [];
    for (const phone of adminPhones) {
      const sendToPhone = async () => {
        try {
          const result = await client.messages.create({
            body: whatsappContent,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${phone}`
          });
          console.log(`✅ WhatsApp sent to ${phone}: ${result.sid}`);
          logNotification('whatsapp', true, { phone, sid: result.sid });
          return { success: true, phone, sid: result.sid, method: 'WhatsApp' };
        } catch (error) {
          // Check for various rate limit and quota errors
          if (error.message.includes('exceeded') || 
              error.message.includes('limit') || 
              error.message.includes('quota') ||
              error.code === 20429 || 
              error.status === 429) {
            console.log(`⚠️  Rate/quota limit hit for ${phone}, trying SMS fallback...`);
            logNotification('whatsapp', false, { phone, error: 'Rate/quota limit', fallback: 'SMS' });
            // Try SMS fallback for this specific admin
            return await sendSMSToAdmin(phone, problemData);
          }
          logNotification('whatsapp', false, { phone, error: error.message });
          throw error;
        }
      };
      
      try {
        const result = await retryWithBackoff(sendToPhone);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to send to ${phone} after retries: ${error.message}`);
        // Try SMS as final fallback
        console.log(`🔄 Trying SMS fallback for ${phone}...`);
        const smsResult = await sendSMSToAdmin(phone, problemData);
        results.push(smsResult);
      }
    }
    
    const successCount = results.filter(r => r && r.success).length;
    const whatsappCount = results.filter(r => r && r.success && r.method === 'WhatsApp').length;
    const smsCount = results.filter(r => r && r.success && r.method === 'SMS').length;
    
    console.log(`📊 Notifications: ${successCount} sent (${whatsappCount} WhatsApp, ${smsCount} SMS), ${results.length - successCount} failed`);
    
    return successCount > 0;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    logNotification('whatsapp_system', false, { error: error.message });
    // Fallback to SMS for all admins
    console.log('🔄 System fallback: trying SMS for all admins...');
    return await exports.sendAdminSMS(problemData);
  }
};

// SMS notification
exports.sendAdminSMS = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('SMS not configured');
      return false;
    }

    const adminPhones = [
      process.env.ADMIN_PHONE_1,
      process.env.ADMIN_PHONE_2,
      process.env.ADMIN_PHONE_3
    ].filter(phone => phone && isValidE164(phone));

    if (adminPhones.length === 0) {
      console.log('No valid admin phone numbers for SMS');
      return false;
    }

    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    let smsGpsText = '';
    if (problemData.location.coordinates && 
        problemData.location.coordinates.latitude && 
        problemData.location.coordinates.longitude) {
      const lat = problemData.location.coordinates.latitude;
      const lng = problemData.location.coordinates.longitude;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      smsGpsText = `\nGPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}\nMaps: ${googleMapsUrl}`;
    }
    
    const smsContent = `🔔 New Complaint - Ward 26
ID: ${problemData.complaintId}
Category: ${categoryBengali}
Location: ${problemData.location.address}${smsGpsText}
Reporter: ${problemData.userName} (${problemData.userPhone})
Time: ${new Date(problemData.createdAt).toLocaleString()}`;

    console.log(`📱 Sending SMS to ${adminPhones.length} admin(s)...`);

    const results = [];
    for (const phone of adminPhones) {
      try {
        const message = await client.messages.create({
          body: smsContent,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        console.log(`✅ SMS sent to ${phone}: ${message.sid}`);
        logNotification('sms', true, { phone, sid: message.sid });
        results.push({ success: true, phone });
      } catch (error) {
        console.error(`❌ SMS failed for ${phone}: ${error.message}`);
        logNotification('sms', false, { phone, error: error.message });
        results.push({ success: false, phone, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`SMS notifications: ${successCount} sent, ${results.length - successCount} failed`);
    return successCount > 0;
  } catch (error) {
    console.error('SMS notification system error:', error);
    logNotification('sms_system', false, { error: error.message });
    return false;
  }
};

// Main notification function - WhatsApp only
exports.notifyAdmins = async (problemData) => {
  console.log('🔔 Sending WhatsApp notifications to admins...');
  
  const results = {
    whatsapp: false,
    sms: false,
    timestamp: new Date().toISOString(),
    attempts: [],
    complaintId: problemData.complaintId,
    diagnostics: {}
  };
  
  // Run diagnostics first
  console.log('🔍 Running Twilio diagnostics...');
  results.diagnostics.twilio = await testTwilioConfiguration();
  
  // Try WhatsApp/SMS with automatic fallback
  try {
    console.log('📱 Attempting WhatsApp/SMS notification...');
    const whatsappResult = await exports.sendWhatsAppNotification(problemData);
    results.whatsapp = whatsappResult;
    results.attempts.push({ method: 'whatsapp_with_sms_fallback', success: whatsappResult });
  } catch (whatsappError) {
    console.error('📱 WhatsApp/SMS notification failed:', whatsappError.message);
    results.attempts.push({ method: 'whatsapp_with_sms_fallback', success: false, error: whatsappError.message });
    
    // Final fallback: try pure SMS
    try {
      console.log('🔄 Final fallback: trying pure SMS...');
      results.sms = await exports.sendAdminSMS(problemData);
      results.attempts.push({ method: 'sms_final_fallback', success: results.sms });
    } catch (smsError) {
      console.error('📱 Final SMS fallback failed:', smsError.message);
      results.attempts.push({ method: 'sms_final_fallback', success: false, error: smsError.message });
    }
  }
  
  // Calculate success metrics
  const successCount = results.attempts.filter(a => a.success).length;
  const totalAttempts = results.attempts.length;
  const successRate = Math.round((successCount / totalAttempts) * 100);
  
  console.log(`📊 WhatsApp notification summary: ${successCount}/${totalAttempts} methods successful (${successRate}%)`);
  console.log('🔍 Diagnostics:', results.diagnostics);
  
  // Log comprehensive results
  logNotification('notify_admins_whatsapp_only', successCount > 0, {
    complaintId: problemData.complaintId,
    results: results,
    successRate: successRate
  });
  
  return results;
};

// Send SMS notification to user when complaint is solved
exports.sendSolvedNotification = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client) {
      console.log('Twilio not configured, skipping solved notification');
      return false;
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio phone number not configured');
      return false;
    }

    // Format user phone number to E.164 if needed
    let userPhone = problemData.userPhone;
    if (!userPhone.startsWith('+')) {
      // Indian numbers: convert 9XXXXXXXXX or 8XXXXXXXXX to +919XXXXXXXXX or +918XXXXXXXXX
      if (userPhone.length === 10 && (userPhone.startsWith('9') || userPhone.startsWith('8') || userPhone.startsWith('7') || userPhone.startsWith('6'))) {
        userPhone = '+91' + userPhone;
      } else {
        userPhone = '+91' + userPhone;
      }
    }

    // Validate phone number format
    if (!isValidE164(userPhone)) {
      console.warn(`⚠️  Invalid user phone number format: ${userPhone}`);
      return false;
    }

    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    // Create solved notification message
    const solvedMessage = `✅ Your complaint (ID: ${problemData.complaintId}) about ${categoryBengali} has been marked as solved. Thank you for reporting to Ward 26 - Amar Elaka Amar Daitto.`;

    console.log(`📱 Sending SMS notification to user: ${userPhone}`);

    // Send regular SMS instead of WhatsApp
    try {
      const message = await client.messages.create({
        body: solvedMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: userPhone
      });

      console.log(`✅ SMS notification sent successfully to ${userPhone}, SID: ${message.sid}`);
      logNotification('solved_notification', true, { phone: userPhone, sid: message.sid });
      return true;
    } catch (twilioError) {
      console.error(`❌ Failed to send SMS notification to ${userPhone}:`, twilioError.message);
      logNotification('solved_notification', false, { phone: userPhone, error: twilioError.message });
      return false;
    }
  } catch (error) {
    console.error('Solved notification error:', error);
    logNotification('solved_notification_system', false, { error: error.message });
    return false;
  }
};

// Export utility functions
exports.retryWithBackoff = retryWithBackoff;
exports.logNotification = logNotification;
exports.testTwilioConfiguration = testTwilioConfiguration;
