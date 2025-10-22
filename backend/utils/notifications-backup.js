const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Twilio client setup
const createTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
};

// Category names in Bengali
const categoryNames = {
  electricity: 'বিদ্যুৎ সমস্যা',
  drainage: 'নর্দমা সমস্যা',
  road: 'রাস্তাঘাট সমস্যা',
  festival: 'উৎসব',
  other: 'অন্যান্য'
};

// Validate phone number in E.164 format
const isValidE164 = (phone) => {
  // E.164 format: +[country code][number]
  // Example: +919876543210 (India), +14155238886 (US)
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

// Send email notification to admins
exports.sendEmailNotification = async (problemData) => {
  try {
    const transporter = createEmailTransporter();
    
    const adminEmails = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3
    ].filter(email => email);

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
      from: process.env.EMAIL_USER,
      to: adminEmails.join(','),
      subject: `নতুন সমস্যা রিপোর্ট - ${categoryBengali}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
};

// Helper function to send WhatsApp message to a single recipient
const sendWhatsApp = async (client, to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    console.log(`WhatsApp sent to ${to}: ${result.sid}`);
    return { success: true, to, sid: result.sid };
  } catch (error) {
    console.error(`WhatsApp error for ${to}:`, error.message);
    return { success: false, to, error: error.message };
  }
};

// Send WhatsApp notification to admins
exports.sendWhatsAppNotification = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client) {
      console.log('Twilio not configured, skipping WhatsApp');
      return false;
    }

    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
      console.log('Twilio WhatsApp number not configured');
      return false;
    }

    // Get admin phone numbers from environment variables
    const adminPhones = [
      process.env.ADMIN_PHONE_1,
      process.env.ADMIN_PHONE_2,
      process.env.ADMIN_PHONE_3
    ].filter(phone => phone);

    if (adminPhones.length === 0) {
      console.log('No admin phone numbers configured');
      return false;
    }

    // Validate phone numbers
    const validPhones = [];
    const invalidPhones = [];
    
    adminPhones.forEach(phone => {
      if (isValidE164(phone)) {
        validPhones.push(phone);
      } else {
        invalidPhones.push(phone);
        console.warn(`⚠️  Invalid phone number format: ${phone} (must be E.164 format, e.g., +919876543210)`);
      }
    });

    if (invalidPhones.length > 0) {
      console.warn(`⚠️  ${invalidPhones.length} invalid phone number(s) skipped`);
    }

    if (validPhones.length === 0) {
      console.log('No valid admin phone numbers to send WhatsApp');
      return false;
    }

    console.log(`📱 Sending WhatsApp to ${validPhones.length} admin(s)...`);

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

    // Create WhatsApp message content
    const whatsappContent = `🔔 *২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট*

📋 *ক্যাটাগরি:* ${categoryBengali}
📌 *সাব-ক্যাটাগরি:* ${problemData.subcategory}
📝 *বিবরণ:* ${problemData.description}
📍 *অবস্থান:* ${problemData.location.address}${gpsLocationText}${problemData.pollNumber ? `\n⚡ *খুঁটির নাম্বার:* ${problemData.pollNumber}` : ''}${problemData.festivalDate ? `\n📅 *তারিখ:* ${new Date(problemData.festivalDate).toLocaleDateString('bn-BD')}` : ''}

👤 *রিপোর্টকারীর তথ্য:*
নাম: ${problemData.userName}
মোবাইল: ${problemData.userPhone}${problemData.userEmail ? `\nইমেইল: ${problemData.userEmail}` : ''}

🕐 *সময়:* ${new Date(problemData.createdAt).toLocaleString('bn-BD')}`;

    // Send WhatsApp to all valid admin numbers
    const whatsappPromises = validPhones.map(phone => 
      sendWhatsApp(client, phone, whatsappContent)
    );

    const results = await Promise.all(whatsappPromises);
    
    // Check if at least one message was sent successfully
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`WhatsApp notifications: ${successCount} sent, ${failCount} failed`);
    
    return successCount > 0;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return false;
  }
};

// Export the helper function for direct use
exports.sendWhatsApp = async (to, message) => {
  try {
    const client = createTwilioClient();
    
    if (!client) {
      throw new Error('Twilio client not configured');
    }

    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
      throw new Error('Twilio WhatsApp number not configured');
    }

    return await sendWhatsApp(client, to, message);
  } catch (error) {
    console.error('sendWhatsApp error:', error);
    throw error;
  }
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
      return true;
    } catch (twilioError) {
      console.error(`❌ Failed to send SMS notification to ${userPhone}:`, twilioError.message);
      return false;
    }
  } catch (error) {
    console.error('Solved notification error:', error);
    return false;
  }
};

// Send SMS acknowledgment to user when complaint is submitted
exports.sendSubmissionAcknowledgment = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio not configured, skipping submission acknowledgment');
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
    
    // Create acknowledgment message
    const ackMessage = `✅ Your complaint has been received! 
ID: ${problemData.complaintId}
Category: ${categoryBengali}
Status: Under Review
We will update you once resolved. Thank you - Ward 26`;

    console.log(`📱 Sending acknowledgment SMS to user: ${userPhone}`);

    try {
      const message = await client.messages.create({
        body: ackMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: userPhone
      });

      console.log(`✅ Acknowledgment SMS sent successfully to ${userPhone}, SID: ${message.sid}`);
      return true;
    } catch (twilioError) {
      console.error(`❌ Failed to send acknowledgment SMS to ${userPhone}:`, twilioError.message);
      return false;
    }
  } catch (error) {
    console.error('Submission acknowledgment error:', error);
    return false;
  }
};

// Send SMS notifications to admins (backup for WhatsApp)
exports.sendAdminSMS = async (problemData) => {
  try {
    const client = createTwilioClient();
    
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio not configured, skipping admin SMS');
      return false;
    }

    // Get admin phone numbers from environment variables
    const adminPhones = [
      process.env.ADMIN_PHONE_1,
      process.env.ADMIN_PHONE_2,
      process.env.ADMIN_PHONE_3
    ].filter(phone => phone);

    if (adminPhones.length === 0) {
      console.log('No admin phone numbers configured');
      return false;
    }

    const categoryBengali = categoryNames[problemData.category] || problemData.category;
    
    // Create GPS location text for SMS if available
    let smsGpsText = '';
    if (problemData.location.coordinates && 
        problemData.location.coordinates.latitude && 
        problemData.location.coordinates.longitude) {
      const lat = problemData.location.coordinates.latitude;
      const lng = problemData.location.coordinates.longitude;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      smsGpsText = `\nGPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}\nMaps: ${googleMapsUrl}`;
    }
    
    // Create SMS message content (shorter than WhatsApp)
    const smsContent = `🔔 New Complaint - Ward 26
ID: ${problemData.complaintId}
Category: ${categoryBengali}
Location: ${problemData.location.address}${smsGpsText}
Reporter: ${problemData.userName} (${problemData.userPhone})
Time: ${new Date(problemData.createdAt).toLocaleString()}`;

    console.log(`📱 Sending SMS to ${adminPhones.length} admin(s)...`);

    // Send SMS to all admin numbers
    const smsPromises = adminPhones.map(async (phone) => {
      try {
        const message = await client.messages.create({
          body: smsContent,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        console.log(`✅ Admin SMS sent to ${phone}, SID: ${message.sid}`);
        return { success: true, phone };
      } catch (error) {
        console.error(`❌ Failed to send admin SMS to ${phone}:`, error.message);
        return { success: false, phone, error: error.message };
      }
    });

    const results = await Promise.all(smsPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`Admin SMS notifications: ${successCount} sent, ${failCount} failed`);
    return successCount > 0;
  } catch (error) {
    console.error('Admin SMS notification error:', error);
    return false;
  }
};

// Send both email and WhatsApp notifications to admins
exports.notifyAdmins = async (problemData) => {
  try {
    let emailResult = false;
    let whatsappResult = false;
    
    // Try email notification with error handling
    try {
      emailResult = await exports.sendEmailNotification(problemData);
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
      emailResult = false;
    }
    
    // Try WhatsApp notification with error handling
    try {
      whatsappResult = await exports.sendWhatsAppNotification(problemData);
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError.message);
      whatsappResult = false;
    }
    
    return {
      email: emailResult,
      whatsapp: whatsappResult
    };
  } catch (error) {
    console.error('Admin notification system error:', error);
    return {
      email: false,
      whatsapp: false
    };
  }
};
