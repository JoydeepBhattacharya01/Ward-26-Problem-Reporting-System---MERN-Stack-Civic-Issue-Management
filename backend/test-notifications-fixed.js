#!/usr/bin/env node

/**
 * Notification System Diagnostic Tool
 * Tests email and SMS/WhatsApp configurations
 * Usage: node test-notifications-fixed.js
 */

require('dotenv').config();
const { 
  testEmailConfiguration, 
  testTwilioConfiguration,
  sendEmailNotificationEnhanced,
  sendWhatsAppNotificationEnhanced,
  notifyAdminsEnhanced
} = require('./utils/notifications-fixed');

// Test data for notifications
const testProblemData = {
  complaintId: 'TEST-' + Date.now(),
  category: 'electricity',
  subcategory: 'Power Outage',
  description: 'Test notification - please ignore',
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

async function runDiagnostics() {
  console.log('🔍 Ward 26 Notification System Diagnostics');
  console.log('==========================================\n');

  // Check environment variables
  console.log('📋 Environment Configuration Check:');
  console.log('-----------------------------------');
  
  const requiredEnvVars = [
    'EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASSWORD',
    'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER',
    'ADMIN_EMAIL_1', 'ADMIN_PHONE_1'
  ];

  const missingVars = [];
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('PASSWORD') || varName.includes('TOKEN') ? '***' : value}`);
    } else {
      console.log(`❌ ${varName}: Not set`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please check your .env file configuration.\n');
  }

  // Test email configuration
  console.log('\n📧 Email Configuration Test:');
  console.log('----------------------------');
  const emailTest = await testEmailConfiguration();
  if (emailTest.success) {
    console.log('✅ Email configuration is valid');
  } else {
    console.log(`❌ Email configuration failed: ${emailTest.error}`);
    console.log('💡 Troubleshooting tips:');
    console.log('   - For Gmail: Use App Password instead of regular password');
    console.log('   - Enable 2-Factor Authentication in Google Account');
    console.log('   - Generate App Password: https://myaccount.google.com/apppasswords');
  }

  // Test Twilio configuration
  console.log('\n📱 Twilio Configuration Test:');
  console.log('-----------------------------');
  const twilioTest = await testTwilioConfiguration();
  if (twilioTest.success) {
    console.log(`✅ Twilio configuration is valid`);
    console.log(`   Account Status: ${twilioTest.accountStatus}`);
    console.log(`   Account Type: ${twilioTest.accountType}`);
  } else {
    console.log(`❌ Twilio configuration failed: ${twilioTest.error}`);
    console.log('💡 Troubleshooting tips:');
    console.log('   - Check Account SID and Auth Token in Twilio Console');
    console.log('   - Verify account is active and not suspended');
    console.log('   - For trial accounts: Upgrade to remove daily limits');
  }

  // Ask user if they want to run live tests
  console.log('\n🧪 Live Notification Tests:');
  console.log('---------------------------');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.toLowerCase().trim());
      });
    });
  };

  try {
    const runTests = await askQuestion('Do you want to run live notification tests? (y/n): ');
    
    if (runTests === 'y' || runTests === 'yes') {
      console.log('\n🚀 Running live notification tests...\n');

      // Test email notification
      console.log('📧 Testing email notification...');
      try {
        const emailResult = await sendEmailNotificationEnhanced(testProblemData);
        if (emailResult) {
          console.log('✅ Email notification sent successfully');
        } else {
          console.log('❌ Email notification failed');
        }
      } catch (error) {
        console.log(`❌ Email notification error: ${error.message}`);
      }

      // Test WhatsApp/SMS notification
      console.log('\n📱 Testing WhatsApp/SMS notification...');
      try {
        const whatsappResult = await sendWhatsAppNotificationEnhanced(testProblemData);
        if (whatsappResult) {
          console.log('✅ WhatsApp/SMS notification sent successfully');
        } else {
          console.log('❌ WhatsApp/SMS notification failed');
        }
      } catch (error) {
        console.log(`❌ WhatsApp/SMS notification error: ${error.message}`);
      }

      // Test complete notification flow
      console.log('\n🔔 Testing complete notification flow...');
      try {
        const fullResult = await notifyAdminsEnhanced(testProblemData);
        console.log('📊 Complete test results:', JSON.stringify(fullResult, null, 2));
      } catch (error) {
        console.log(`❌ Complete notification flow error: ${error.message}`);
      }
    }

    console.log('\n✨ Diagnostics completed!');
    console.log('\n📝 Next Steps:');
    console.log('1. Fix any configuration issues identified above');
    console.log('2. Update your .env file with correct credentials');
    console.log('3. For Gmail: Use App Password instead of regular password');
    console.log('4. For Twilio: Upgrade account if hitting daily limits');
    console.log('5. Replace the old notifications.js with notifications-fixed.js');

  } catch (error) {
    console.error('Error during diagnostics:', error);
  } finally {
    rl.close();
  }
}

// Run diagnostics if this file is executed directly
if (require.main === module) {
  runDiagnostics().catch(console.error);
}

module.exports = { runDiagnostics };
