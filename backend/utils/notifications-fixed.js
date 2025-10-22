const nodemailer = require('nodemailer');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

// Enhanced notification system with multiple email providers and better error handling
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Multiple email transporter configurations
const createEmailTransporter = () => {
  // Primary: Gmail with App Password
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        }
      });
    } catch (error) {
      console.error('Primary email transporter failed:', error.message);
    }
  }

  // Fallback: SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      return nodemailer.createTransporter({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } catch (error) {
      console.error('SendGrid transporter failed:', error.message);
    }
  }

  // Fallback: Mailgun
  if (process.env.MAILGUN_SMTP_LOGIN && process.env.MAILGUN_SMTP_PASSWORD) {
    try {
      return nodemailer.createTransporter({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD
        }
      });
    } catch (error) {
      console.error('Mailgun transporter failed:', error.message);
    }
  }

  console.error('No email transporter could be created. Check your email configuration.');
  return null;
};

// Twilio client setup with better error handling
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
  console.log('Twilio not configured - SMS/WhatsApp notifications disabled');
  return null;
};

// Category names in Bengali
const categoryNames = {
  electricity: 'বিদ্যুৎ সমস্যা',
  drainage: 'নর্দমা সমস্যা',
  road: 'রাস্তাঘাট সমস্যা',
  festival: 'উৎসব',
  medical_emergency: 'চিকিৎসা জরুরি অবস্থা',
  other: 'অন্যান্য'
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

// Enhanced logging with better error categorization
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

// Test email configuration
async function testEmailConfiguration() {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      return { success: false, error: 'No email transporter available' };
    }

    // Verify connection
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, error: error.message };
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

// Enhanced email notification with multiple provider fallback
exports.sendEmailNotificationEnhanced = async (problemData) => {
  const sendEmail = async () => {
    try {
      const transporter = createEmailTransporter();
      
      if (!transporter) {
        throw new Error('No email transporter available - check email configuration');
      }

      const adminEmails = [
        process.env.ADMIN_EMAIL_1,
        process.env.ADMIN_EMAIL_2,
        process.env.ADMIN_EMAIL_3
      ].filter(email => email && email.includes('@'));

      if (adminEmails.length === 0) {
        throw new Error('No valid admin email addresses configured');
      }

      const categoryBengali = categoryNames[problemData.category] || problemData.category;
      
      // Create GPS location HTML if available
      let gpsLocationHtml = '';
      if (problemData.location.coordinates && 
          problemData.location.coordinates.latitude && 
          problemData.location.coordinates.longitude) {
        const lat = problemData.location.coordinates.latitude;
        const lng = problemData.location.coordinates.longitude;
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        gpsLocationHtml = `<p><strong>GPS স্থানাঙ্ক:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              <p><strong>Google Maps:</strong> <a href="${googleMapsUrl}" target="_blank" style="color: #1e40af;">মানচিত্রে দেখুন</a></p>`;
      }
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
              ২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট
            </h2>
            
            <div style="margin: 20px 0;">
              <p><strong>অভিযোগ নম্বর:</strong> ${problemData.complaintId}</p>
              <p><strong>ক্যাটাগরি:</strong> ${categoryBengali}</p>
              <p><strong>সাব-ক্যাটাগরি:</strong> ${problemData.subcategory}</p>
              <p><strong>বিবরণ:</strong> ${problemData.description}</p>
              <p><strong>অবস্থান:</strong> ${problemData.location.address}</p>
              ${gpsLocationHtml}
              ${problemData.pollNumber ? `<p><strong>খুঁটির নাম্বার:</strong> ${problemData.pollNumber}</p>` : ''}
              ${problemData.festivalDate ? `<p><strong>তারিখ:</strong> ${new Date(problemData.festivalDate).toLocaleDateString('bn-BD')}</p>` : ''}
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">রিপোর্টকারীর তথ্য</h3>
              <p><strong>নাম:</strong> ${problemData.userName}</p>
              <p><strong>মোবাইল:</strong> ${problemData.userPhone}</p>
              ${problemData.userEmail ? `<p><strong>ইমেইল:</strong> ${problemData.userEmail}</p>` : ''}
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              <strong>সময়:</strong> ${new Date(problemData.createdAt).toLocaleString('bn-BD')}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@ward26.gov.bd',
        to: adminEmails.join(','),
        subject: `নতুন সমস্যা রিপোর্ট - ${categoryBengali} [${problemData.complaintId}]`,
        html: emailContent
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent successfully:', result.messageId);
      logNotification('email', true, { 
        recipients: adminEmails.length, 
        messageId: result.messageId,
        provider: 'configured'
      });
      return true;
    } catch (error) {
      console.error('Email notification error:', error.message);
      logNotification('email', false, { error: error.message });
      throw error;
    }
  };

  try {
    return await retryWithBackoff(sendEmail);
  } catch (error) {
    console.error('Email notification failed after retries:', error.message);
    return false;
  }
};

// SMS fallback for individual admin with better error handling
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

// Enhanced WhatsApp notification with better rate limit handling
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

    console.log(`📱 Sending enhanced WhatsApp to ${adminPhones.length} admin(s)...`);

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
    
    console.log(`📊 Enhanced notifications: ${successCount} sent (${whatsappCount} WhatsApp, ${smsCount} SMS), ${results.length - successCount} failed`);
    
    return successCount > 0;
  } catch (error) {
    console.error('Enhanced WhatsApp notification error:', error);
    logNotification('whatsapp_system', false, { error: error.message });
    // Fallback to SMS for all admins
    console.log('🔄 System fallback: trying SMS for all admins...');
    return await exports.sendAdminSMS(problemData);
  }
};

// Enhanced SMS notification
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

// Enhanced notifyAdmins with comprehensive diagnostics
exports.notifyAdminsEnhanced = async (problemData) => {
  console.log('🔔 Sending enhanced notifications to admins...');
  
  const results = {
    email: false,
    whatsapp: false,
    sms: false,
    timestamp: new Date().toISOString(),
    attempts: [],
    complaintId: problemData.complaintId,
    diagnostics: {}
  };
  
  // Run diagnostics first
  console.log('🔍 Running notification diagnostics...');
  results.diagnostics.email = await testEmailConfiguration();
  results.diagnostics.twilio = await testTwilioConfiguration();
  
  // Try email with retry
  try {
    console.log('📧 Attempting enhanced email notification...');
    results.email = await exports.sendEmailNotificationEnhanced(problemData);
    results.attempts.push({ method: 'email', success: results.email });
  } catch (emailError) {
    console.error('📧 Email notification failed:', emailError.message);
    results.attempts.push({ method: 'email', success: false, error: emailError.message });
  }
  
  // Try enhanced WhatsApp/SMS with automatic fallback
  try {
    console.log('📱 Attempting enhanced WhatsApp/SMS notification...');
    const whatsappResult = await exports.sendWhatsAppNotificationEnhanced(problemData);
    results.whatsapp = whatsappResult;
    results.attempts.push({ method: 'whatsapp_enhanced', success: whatsappResult });
  } catch (whatsappError) {
    console.error('📱 WhatsApp/SMS notification failed:', whatsappError.message);
    results.attempts.push({ method: 'whatsapp_enhanced', success: false, error: whatsappError.message });
    
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
  
  console.log(`📊 Enhanced notification summary: ${successCount}/${totalAttempts} methods successful (${successRate}%)`);
  console.log('🔍 Diagnostics:', results.diagnostics);
  
  // Log comprehensive results
  logNotification('notify_admins_enhanced', successCount > 0, {
    complaintId: problemData.complaintId,
    results: results,
    successRate: successRate
  });
  
  return results;
};

// Backward compatibility - keep original function names
exports.sendEmailNotification = exports.sendEmailNotificationEnhanced;
exports.sendWhatsAppNotification = exports.sendWhatsAppNotificationEnhanced;
exports.notifyAdmins = exports.notifyAdminsEnhanced;

// Export utility functions
exports.retryWithBackoff = retryWithBackoff;
exports.logNotification = logNotification;
exports.testEmailConfiguration = testEmailConfiguration;
exports.testTwilioConfiguration = testTwilioConfiguration;
