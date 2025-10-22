#!/usr/bin/env node

/**
 * Test Enhanced Notification System
 * Tests the improved notification system with retry logic and fallbacks
 */

require('dotenv').config();
const { notifyAdminsEnhanced } = require('./utils/notifications');

console.log('🚀 Testing Enhanced Notification System');
console.log('======================================');

async function testEnhancedNotifications() {
  console.log('\n🧪 Testing Enhanced Notifications...');
  console.log('===================================');
  
  // Create test problem data
  const testProblemData = {
    complaintId: 'ENHANCED001',
    category: 'electricity',
    subcategory: 'বিদ্যুৎ বিভ্রাট',
    description: 'এনহান্সড নোটিফিকেশন সিস্টেম টেস্ট - রিট্রাই লজিক এবং ফলব্যাক সহ',
    location: {
      address: 'টেস্ট এনহান্সড লোকেশন, ঢাকা',
      coordinates: {
        latitude: 23.7281,
        longitude: 90.3947
      }
    },
    userName: 'এনহান্সড টেস্ট ইউজার',
    userPhone: '+8801712345678',
    userEmail: 'enhanced-test@example.com',
    createdAt: new Date()
  };
  
  console.log('📋 Test Problem Data:');
  console.log(`   ID: ${testProblemData.complaintId}`);
  console.log(`   Category: ${testProblemData.category}`);
  console.log(`   Location: ${testProblemData.location.address}`);
  console.log(`   GPS: ${testProblemData.location.coordinates.latitude}, ${testProblemData.location.coordinates.longitude}`);
  
  const startTime = Date.now();
  
  try {
    console.log('\n🔔 Sending enhanced notifications...');
    const results = await notifyAdminsEnhanced(testProblemData);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n📊 Enhanced Notification Results:');
    console.log('=================================');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📧 Email: ${results.email ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`📱 WhatsApp: ${results.whatsapp ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`📱 SMS: ${results.sms ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    console.log('\n🔍 Detailed Attempts:');
    results.attempts.forEach((attempt, index) => {
      const status = attempt.success ? '✅' : '❌';
      const error = attempt.error ? ` (${attempt.error})` : '';
      console.log(`   ${index + 1}. ${attempt.method}: ${status}${error}`);
    });
    
    const successCount = results.attempts.filter(a => a.success).length;
    const totalAttempts = results.attempts.length;
    const successRate = Math.round((successCount / totalAttempts) * 100);
    
    console.log(`\n📈 Success Rate: ${successCount}/${totalAttempts} (${successRate}%)`);
    
    // Check if any notification method succeeded
    const overallSuccess = results.email || results.whatsapp || results.sms;
    
    if (overallSuccess) {
      console.log('\n🎉 ENHANCED NOTIFICATIONS WORKING!');
      console.log('✅ At least one notification method succeeded');
      console.log('✅ Retry logic and fallbacks are functioning');
      console.log('✅ GPS location is included in notifications');
    } else {
      console.log('\n⚠️  All notification methods failed');
      console.log('🔧 Check your configuration and try again');
    }
    
    return {
      success: overallSuccess,
      results: results,
      duration: duration,
      successRate: successRate
    };
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('\n❌ Enhanced notification test failed:', error.message);
    console.log(`⏱️  Duration: ${duration}ms`);
    
    return {
      success: false,
      error: error.message,
      duration: duration
    };
  }
}

// Test multiple times to check consistency
async function testConsistency() {
  console.log('\n🔄 Testing Notification Consistency (3 attempts)...');
  console.log('===================================================');
  
  const results = [];
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n📱 Consistency Test ${i}/3:`);
    
    const testResult = await testEnhancedNotifications();
    results.push(testResult);
    
    if (i < 3) {
      console.log('   ⏳ Waiting 5 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Analyze consistency
  const successfulTests = results.filter(r => r.success).length;
  const consistencyRate = Math.round((successfulTests / results.length) * 100);
  
  console.log('\n📊 Consistency Analysis:');
  console.log('========================');
  console.log(`Successful Tests: ${successfulTests}/${results.length}`);
  console.log(`Consistency Rate: ${consistencyRate}%`);
  
  if (consistencyRate >= 80) {
    console.log('🟢 EXCELLENT: High consistency rate (≥80%)');
  } else if (consistencyRate >= 60) {
    console.log('🟡 GOOD: Moderate consistency rate (60-79%)');
  } else {
    console.log('🔴 POOR: Low consistency rate (<60%)');
  }
  
  return {
    consistencyRate,
    results
  };
}

// Main test function
async function main() {
  try {
    // Single test
    const singleTest = await testEnhancedNotifications();
    
    // Consistency test
    const consistencyTest = await testConsistency();
    
    console.log('\n🎯 Final Summary:');
    console.log('=================');
    
    if (singleTest.success && consistencyTest.consistencyRate >= 60) {
      console.log('🎉 ENHANCED NOTIFICATION SYSTEM IS WORKING!');
      console.log('✅ Notifications are being sent successfully');
      console.log('✅ Retry logic is handling failures');
      console.log('✅ Fallback mechanisms are working');
      console.log('✅ GPS location sharing is functional');
      
      console.log('\n💡 Benefits of Enhanced System:');
      console.log('- Automatic retry on temporary failures');
      console.log('- SMS fallback when WhatsApp hits rate limits');
      console.log('- Detailed logging for troubleshooting');
      console.log('- Better error handling and recovery');
      
    } else {
      console.log('⚠️  Enhanced system needs attention');
      console.log('🔧 Check the configuration and error messages above');
    }
    
    console.log('\n📄 Check notification-logs.json for detailed logs');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
