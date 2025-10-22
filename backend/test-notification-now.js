#!/usr/bin/env node

/**
 * Immediate Notification Test
 * Tests the current notification system with real data
 */

require('dotenv').config();
const { notifyAdmins } = require('./utils/notifications');

// Test with realistic problem data
const testProblemData = {
  _id: '507f1f77bcf86cd799439011',
  complaintId: 'LIVE-TEST-' + Date.now(),
  category: 'electricity',
  subcategory: 'Power Outage',
  description: 'Live notification test - this should reach admins if system is working',
  location: {
    address: 'Test Location, Ward 26, Kolkata',
    coordinates: {
      latitude: 22.5726,
      longitude: 88.3639
    }
  },
  userName: 'Test Reporter',
  userPhone: '+919876543210',
  userEmail: 'test@example.com',
  createdAt: new Date(),
  status: 'pending'
};

async function testNotificationNow() {
  console.log('🚨 LIVE Notification Test Starting...');
  console.log('=====================================\n');

  console.log('📋 Test Problem Data:');
  console.log(`Complaint ID: ${testProblemData.complaintId}`);
  console.log(`Category: ${testProblemData.category}`);
  console.log(`Description: ${testProblemData.description}`);
  console.log(`Location: ${testProblemData.location.address}`);
  console.log('');

  console.log('🔍 Environment Check:');
  console.log(`Email User: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`Email Password: ${process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`Twilio SID: ${process.env.TWILIO_ACCOUNT_SID || 'NOT SET'}`);
  console.log(`Twilio Token: ${process.env.TWILIO_AUTH_TOKEN ? 'SET' : 'NOT SET'}`);
  console.log(`Admin Email 1: ${process.env.ADMIN_EMAIL_1 || 'NOT SET'}`);
  console.log(`Admin Phone 1: ${process.env.ADMIN_PHONE_1 || 'NOT SET'}`);
  console.log('');

  try {
    console.log('🔔 Calling notifyAdmins function...');
    console.log('This will attempt to send real notifications to admins!');
    console.log('');

    const startTime = Date.now();
    const result = await notifyAdmins(testProblemData);
    const endTime = Date.now();

    console.log(`⏱️  Notification completed in ${endTime - startTime}ms`);
    console.log('');

    if (result) {
      console.log('✅ NOTIFICATION SYSTEM IS WORKING!');
      console.log('📊 Results:', JSON.stringify(result, null, 2));
      
      if (result.email) {
        console.log('✅ Email notifications: SUCCESS');
      } else {
        console.log('❌ Email notifications: FAILED');
      }
      
      if (result.whatsapp) {
        console.log('✅ WhatsApp notifications: SUCCESS');
      } else {
        console.log('❌ WhatsApp notifications: FAILED');
      }
      
    } else {
      console.log('❌ NOTIFICATION SYSTEM FAILED');
      console.log('No notifications were sent successfully');
    }

  } catch (error) {
    console.log('❌ NOTIFICATION ERROR:');
    console.log(`Error: ${error.message}`);
    console.log(`Stack: ${error.stack}`);
  }

  // Check recent logs
  console.log('\n📄 Checking recent notification logs...');
  try {
    const fs = require('fs');
    const path = require('path');
    const logFile = path.join(__dirname, 'notification-logs.json');
    
    if (fs.existsSync(logFile)) {
      const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      const recentLogs = logs.slice(-5); // Last 5 entries
      
      console.log('Recent log entries:');
      recentLogs.forEach((log, index) => {
        const status = log.success ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${log.type} - ${log.timestamp}`);
        if (!log.success && log.error) {
          console.log(`   Error: ${log.error}`);
        }
      });
    } else {
      console.log('No notification logs found');
    }
  } catch (logError) {
    console.log(`Error reading logs: ${logError.message}`);
  }

  console.log('\n🔧 Troubleshooting Tips:');
  console.log('1. Check if Gmail App Password is set correctly');
  console.log('2. Verify Twilio phone number is purchased');
  console.log('3. Ensure WhatsApp sandbox is configured');
  console.log('4. Check admin email/phone numbers are valid');
  console.log('\n💡 Run: node configure-new-twilio.js for detailed diagnostics');
}

if (require.main === module) {
  testNotificationNow().catch(console.error);
}

module.exports = { testNotificationNow };
