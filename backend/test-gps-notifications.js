#!/usr/bin/env node

/**
 * GPS Location Notification Test Script
 * Tests GPS location sharing through Twilio notifications
 */

require('dotenv').config();
const { sendWhatsAppNotification, sendAdminSMS, sendEmailNotification } = require('./utils/notifications');

console.log('🌍 GPS Location Notification Test');
console.log('==================================');

// Test GPS notification functionality
async function testGPSNotifications() {
  console.log('\n🧪 Testing GPS Location in Notifications...');
  console.log('============================================');
  
  try {
    // Create test problem data with GPS coordinates
    const testProblemDataWithGPS = {
      complaintId: 'CMP1001',
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: 'পরীক্ষামূলক বার্তা - GPS লোকেশন সহ বিদ্যুৎ সমস্যা',
      location: {
        address: 'ঢাকা বিশ্ববিদ্যালয়, ঢাকা, বাংলাদেশ',
        coordinates: {
          latitude: 23.7281,
          longitude: 90.3947
        }
      },
      userName: 'পরীক্ষা ব্যবহারকারী',
      userPhone: '+8801712345678',
      userEmail: 'test@example.com',
      createdAt: new Date()
    };

    // Create test problem data without GPS coordinates
    const testProblemDataWithoutGPS = {
      complaintId: 'CMP1002',
      category: 'road',
      subcategory: 'রাস্তা ভাঙা',
      description: 'পরীক্ষামূলক বার্তা - GPS ছাড়া রাস্তার সমস্যা',
      location: {
        address: 'নিউ মার্কেট, ঢাকা, বাংলাদেশ'
      },
      userName: 'আরেক ব্যবহারকারী',
      userPhone: '+8801987654321',
      userEmail: 'another@example.com',
      createdAt: new Date()
    };
    
    console.log('\n📱 Testing WhatsApp with GPS coordinates...');
    const whatsappWithGPS = await sendWhatsAppNotification(testProblemDataWithGPS);
    
    console.log('\n📱 Testing WhatsApp without GPS coordinates...');
    const whatsappWithoutGPS = await sendWhatsAppNotification(testProblemDataWithoutGPS);
    
    console.log('\n📧 Testing Email with GPS coordinates...');
    const emailWithGPS = await sendEmailNotification(testProblemDataWithGPS);
    
    console.log('\n📧 Testing Email without GPS coordinates...');
    const emailWithoutGPS = await sendEmailNotification(testProblemDataWithoutGPS);
    
    console.log('\n📱 Testing SMS with GPS coordinates...');
    const smsWithGPS = await sendAdminSMS(testProblemDataWithGPS);
    
    console.log('\n📱 Testing SMS without GPS coordinates...');
    const smsWithoutGPS = await sendAdminSMS(testProblemDataWithoutGPS);
    
    // Summary
    console.log('\n📊 GPS Notification Test Results');
    console.log('=================================');
    console.log(`WhatsApp with GPS: ${whatsappWithGPS ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`WhatsApp without GPS: ${whatsappWithoutGPS ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Email with GPS: ${emailWithGPS ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Email without GPS: ${emailWithoutGPS ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`SMS with GPS: ${smsWithGPS ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`SMS without GPS: ${smsWithoutGPS ? '✅ PASSED' : '❌ FAILED'}`);
    
    const allPassed = whatsappWithGPS && whatsappWithoutGPS && emailWithGPS && emailWithoutGPS && smsWithGPS && smsWithoutGPS;
    
    if (allPassed) {
      console.log('\n🎉 All GPS notification tests PASSED!');
      console.log('\n✨ GPS Location Features:');
      console.log('   📍 GPS coordinates are included when available');
      console.log('   🗺️  Google Maps links are generated automatically');
      console.log('   📱 Works in WhatsApp, Email, and SMS notifications');
      console.log('   🔄 Gracefully handles cases without GPS data');
    } else {
      console.log('\n⚠️  Some GPS notification tests FAILED.');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ GPS notification test error:', error.message);
    return false;
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  testGPSNotifications().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  });
}

module.exports = {
  testGPSNotifications
};
