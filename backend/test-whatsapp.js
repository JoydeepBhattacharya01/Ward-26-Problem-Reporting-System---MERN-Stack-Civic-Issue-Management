#!/usr/bin/env node

/**
 * WhatsApp Test Script
 * Tests WhatsApp functionality without requiring database connection
 */

require('dotenv').config();
const { sendWhatsApp, sendWhatsAppNotification, notifyAdmins } = require('./utils/notifications');

console.log('🔍 WhatsApp Configuration Check');
console.log('================================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER || '❌ Missing');
console.log('ADMIN_PHONE_1:', process.env.ADMIN_PHONE_1 || '❌ Missing');
console.log('ADMIN_PHONE_2:', process.env.ADMIN_PHONE_2 || '❌ Missing');
console.log('ADMIN_PHONE_3:', process.env.ADMIN_PHONE_3 || '❌ Missing');

// Test WhatsApp notification
async function testWhatsAppNotification() {
  console.log('\n🧪 Testing WhatsApp Notification...');
  console.log('===================================');
  
  try {
    // Create test problem data
    const testProblemData = {
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: 'পরীক্ষামূলক বার্তা - WhatsApp কার্যকারিতা পরীক্ষা',
      location: {
        address: 'ঢাকা, বাংলাদেশ'
      },
      userName: 'পরীক্ষা ব্যবহারকারী',
      userPhone: '+8801712345678',
      userEmail: 'test@example.com',
      createdAt: new Date()
    };
    
    console.log('📱 Sending test WhatsApp notification...');
    const result = await sendWhatsAppNotification(testProblemData);
    
    if (result) {
      console.log('✅ WhatsApp notification test PASSED');
      return true;
    } else {
      console.log('❌ WhatsApp notification test FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ WhatsApp test error:', error.message);
    return false;
  }
}

// Test individual WhatsApp message
async function testSingleWhatsApp() {
  console.log('\n🧪 Testing Single WhatsApp Message...');
  console.log('====================================');
  
  try {
    const testPhone = process.env.ADMIN_PHONE_1;
    if (!testPhone) {
      console.log('❌ No admin phone number configured for testing');
      return false;
    }
    
    const testMessage = `🔔 *পরীক্ষামূলক বার্তা*

এটি একটি WhatsApp কার্যকারিতা পরীক্ষা।

সময়: ${new Date().toLocaleString('bn-BD')}

ওয়ার্ড ২৬ সিস্টেম`;
    
    console.log(`📱 Sending test message to ${testPhone}...`);
    const result = await sendWhatsApp(testPhone, testMessage);
    
    if (result.success) {
      console.log('✅ Single WhatsApp message test PASSED');
      console.log('📋 Message SID:', result.sid);
      return true;
    } else {
      console.log('❌ Single WhatsApp message test FAILED');
      console.log('❌ Error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Single WhatsApp test error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('\n🚀 Starting WhatsApp Tests...');
  console.log('=============================');
  
  let passedTests = 0;
  let totalTests = 2;
  
  // Test 1: Single WhatsApp message
  if (await testSingleWhatsApp()) {
    passedTests++;
  }
  
  // Test 2: WhatsApp notification to all admins
  if (await testWhatsAppNotification()) {
    passedTests++;
  }
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests PASSED! WhatsApp is working correctly.');
    console.log('\n💡 If you\'re not receiving messages, check:');
    console.log('   1. Admin phone numbers have joined WhatsApp sandbox');
    console.log('   2. Phone numbers are in correct E.164 format');
    console.log('   3. Twilio console logs for delivery status');
  } else {
    console.log('\n⚠️  Some tests FAILED. Check the errors above.');
    console.log('\n🔧 Common issues:');
    console.log('   1. Missing or incorrect Twilio credentials');
    console.log('   2. WhatsApp sandbox not configured');
    console.log('   3. Admin phone numbers not joined to sandbox');
    console.log('   4. Invalid phone number format');
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run tests if script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  });
}

module.exports = {
  testWhatsAppNotification,
  testSingleWhatsApp,
  runTests
};
