#!/usr/bin/env node

/**
 * Notification Diagnostic Script
 * Diagnoses why admin notifications are not working
 */

require('dotenv').config();
const { notifyAdmins, sendWhatsAppNotification, sendEmailNotification } = require('./utils/notifications');

console.log('🔍 Admin Notification Diagnostic');
console.log('=================================');

// Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('===============================');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER || '❌ Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌ Missing');

console.log('\nAdmin Phone Numbers:');
console.log('ADMIN_PHONE_1:', process.env.ADMIN_PHONE_1 || '❌ Missing');
console.log('ADMIN_PHONE_2:', process.env.ADMIN_PHONE_2 || '❌ Missing');
console.log('ADMIN_PHONE_3:', process.env.ADMIN_PHONE_3 || '❌ Missing');

console.log('\nAdmin Email Addresses:');
console.log('ADMIN_EMAIL_1:', process.env.ADMIN_EMAIL_1 || '❌ Missing');
console.log('ADMIN_EMAIL_2:', process.env.ADMIN_EMAIL_2 || '❌ Missing');
console.log('ADMIN_EMAIL_3:', process.env.ADMIN_EMAIL_3 || '❌ Missing');

console.log('\nEmail Configuration:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '❌ Missing');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '❌ Missing');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');

// Test notification system
async function testNotificationSystem() {
  console.log('\n🧪 Testing Notification System...');
  console.log('==================================');
  
  try {
    // Create test problem data
    const testProblemData = {
      complaintId: 'TEST001',
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: 'ডায়াগনস্টিক টেস্ট - এটি একটি পরীক্ষামূলক বার্তা',
      location: {
        address: 'টেস্ট লোকেশন, ঢাকা',
        coordinates: {
          latitude: 23.7281,
          longitude: 90.3947
        }
      },
      userName: 'টেস্ট ব্যবহারকারী',
      userPhone: '+8801712345678',
      userEmail: 'test@example.com',
      createdAt: new Date()
    };
    
    console.log('\n📱 Testing WhatsApp Notification...');
    const whatsappResult = await sendWhatsAppNotification(testProblemData);
    console.log('WhatsApp Result:', whatsappResult ? '✅ SUCCESS' : '❌ FAILED');
    
    console.log('\n📧 Testing Email Notification...');
    const emailResult = await sendEmailNotification(testProblemData);
    console.log('Email Result:', emailResult ? '✅ SUCCESS' : '❌ FAILED');
    
    console.log('\n🔔 Testing Combined notifyAdmins Function...');
    const combinedResult = await notifyAdmins(testProblemData);
    console.log('Combined Results:');
    console.log('- Email:', combinedResult.email ? '✅ SUCCESS' : '❌ FAILED');
    console.log('- WhatsApp:', combinedResult.whatsapp ? '✅ SUCCESS' : '❌ FAILED');
    
    // Summary
    console.log('\n📊 Diagnostic Summary');
    console.log('=====================');
    
    if (combinedResult.whatsapp && combinedResult.email) {
      console.log('🎉 All notifications are working correctly!');
      console.log('If admins are not receiving notifications, check:');
      console.log('1. Admin phone numbers have joined WhatsApp sandbox');
      console.log('2. Admin email addresses are correct');
      console.log('3. Email server credentials are valid');
    } else if (combinedResult.whatsapp && !combinedResult.email) {
      console.log('✅ WhatsApp notifications are working');
      console.log('❌ Email notifications are failing');
      console.log('Check email server configuration in .env file');
    } else if (!combinedResult.whatsapp && combinedResult.email) {
      console.log('❌ WhatsApp notifications are failing');
      console.log('✅ Email notifications are working');
      console.log('Check Twilio WhatsApp configuration');
    } else {
      console.log('❌ Both notification systems are failing');
      console.log('Check your .env configuration');
    }
    
    return combinedResult;
  } catch (error) {
    console.error('❌ Diagnostic test error:', error.message);
    return { email: false, whatsapp: false };
  }
}

// Check if problem submission triggers notifications
async function checkProblemSubmissionFlow() {
  console.log('\n🔍 Checking Problem Submission Flow...');
  console.log('======================================');
  
  // Check if the routes/problems.js file calls notifyAdmins
  const fs = require('fs');
  const path = require('path');
  
  try {
    const problemsRouteFile = path.join(__dirname, 'routes', 'problems.js');
    const content = fs.readFileSync(problemsRouteFile, 'utf8');
    
    if (content.includes('notifyAdmins(problem)')) {
      console.log('✅ Problem submission route calls notifyAdmins()');
    } else {
      console.log('❌ Problem submission route does NOT call notifyAdmins()');
      console.log('This might be the issue - notifications are not triggered on problem submission');
    }
    
    if (content.includes('catch (error)')) {
      console.log('✅ Error handling is present for notifications');
    } else {
      console.log('⚠️  No error handling found for notifications');
    }
  } catch (error) {
    console.error('❌ Could not check problem submission flow:', error.message);
  }
}

// Main diagnostic function
async function runDiagnostics() {
  await checkProblemSubmissionFlow();
  const results = await testNotificationSystem();
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('=========================');
  
  if (!results.whatsapp && !results.email) {
    console.log('1. Check your .env file configuration');
    console.log('2. Ensure all required environment variables are set');
    console.log('3. Verify Twilio credentials are correct');
    console.log('4. Check email server credentials');
  }
  
  if (!results.whatsapp) {
    console.log('For WhatsApp issues:');
    console.log('- Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
    console.log('- Check TWILIO_WHATSAPP_NUMBER is correct');
    console.log('- Ensure admin phone numbers are in E.164 format');
    console.log('- Verify admins have joined WhatsApp sandbox');
  }
  
  if (!results.email) {
    console.log('For Email issues:');
    console.log('- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD');
    console.log('- Verify email server allows SMTP connections');
    console.log('- Check if 2FA is enabled (may need app password)');
  }
  
  process.exit(results.whatsapp || results.email ? 0 : 1);
}

// Run diagnostics if script is executed directly
if (require.main === module) {
  runDiagnostics().catch(error => {
    console.error('❌ Diagnostic runner error:', error);
    process.exit(1);
  });
}

module.exports = {
  testNotificationSystem,
  checkProblemSubmissionFlow,
  runDiagnostics
};
