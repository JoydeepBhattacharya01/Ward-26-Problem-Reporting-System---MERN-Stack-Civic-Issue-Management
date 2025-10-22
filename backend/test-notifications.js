#!/usr/bin/env node

// Notification Configuration Test Script
// Run this to diagnose notification issues

require('dotenv').config();
const { testEmailConfiguration, testTwilioConfiguration } = require('./utils/notifications');

async function runDiagnostics() {
  console.log('🔍 Ward 26 Notification Diagnostics\n');
  console.log('=' .repeat(50));
  
  // Check environment variables
  console.log('\n📋 Environment Variables Check:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '❌ Not set');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set (hidden)' : '❌ Not set');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set (hidden)' : '❌ Not set');
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set (hidden)' : '❌ Not set');
  console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌ Not set');
  console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER || '❌ Not set');
  
  // Admin contacts
  console.log('\n👥 Admin Contacts:');
  const adminEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
    process.env.ADMIN_EMAIL_3
  ].filter(email => email && email.includes('@'));
  
  const adminPhones = [
    process.env.ADMIN_PHONE_1,
    process.env.ADMIN_PHONE_2,
    process.env.ADMIN_PHONE_3
  ].filter(phone => phone && phone.startsWith('+'));
  
  console.log(`Email addresses: ${adminEmails.length} configured`);
  adminEmails.forEach((email, i) => console.log(`  ${i + 1}. ${email}`));
  
  console.log(`Phone numbers: ${adminPhones.length} configured`);
  adminPhones.forEach((phone, i) => console.log(`  ${i + 1}. ${phone}`));
  
  // Test email configuration
  console.log('\n📧 Testing Email Configuration...');
  try {
    const emailTest = await testEmailConfiguration();
    if (emailTest.success) {
      console.log('✅ Email configuration is valid');
    } else {
      console.log('❌ Email configuration failed:', emailTest.error);
      console.log('\n💡 Email troubleshooting:');
      console.log('1. Make sure EMAIL_USER is your actual Gmail address');
      console.log('2. EMAIL_PASSWORD should be a Gmail App Password (not your regular password)');
      console.log('3. Enable 2-Factor Authentication on your Gmail account');
      console.log('4. Generate App Password: Google Account → Security → 2-Step Verification → App passwords');
    }
  } catch (error) {
    console.log('❌ Email test error:', error.message);
  }
  
  // Test Twilio configuration
  console.log('\n📱 Testing Twilio Configuration...');
  try {
    const twilioTest = await testTwilioConfiguration();
    if (twilioTest.success) {
      console.log('✅ Twilio configuration is valid');
      console.log(`   Account Status: ${twilioTest.accountStatus}`);
      console.log(`   Account Type: ${twilioTest.accountType}`);
    } else {
      console.log('❌ Twilio configuration failed:', twilioTest.error);
      console.log('\n💡 Twilio troubleshooting:');
      console.log('1. Check your Twilio Account SID and Auth Token');
      console.log('2. Verify your Twilio phone number is correct');
      console.log('3. Check if you have reached daily message limits');
      console.log('4. For WhatsApp, ensure your sandbox is set up properly');
    }
  } catch (error) {
    console.log('❌ Twilio test error:', error.message);
  }
  
  // Configuration recommendations
  console.log('\n💡 Configuration Recommendations:');
  
  if (process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('❌ Update EMAIL_USER with your actual Gmail address');
  }
  
  if (process.env.EMAIL_PASSWORD === 'your_app_password_here') {
    console.log('❌ Update EMAIL_PASSWORD with your Gmail App Password');
  }
  
  if (process.env.TWILIO_PHONE_NUMBER === '+1234567890') {
    console.log('❌ Update TWILIO_PHONE_NUMBER with your actual Twilio number');
  }
  
  if (adminEmails.length === 0) {
    console.log('❌ No valid admin email addresses configured');
  }
  
  if (adminPhones.length === 0) {
    console.log('❌ No valid admin phone numbers configured');
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Diagnostics Complete');
  
  // Summary
  const emailOk = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com' && 
                  process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD !== 'your_app_password_here';
  const twilioOk = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;
  
  console.log('\n📊 Summary:');
  console.log(`Email: ${emailOk ? '✅ Configured' : '❌ Needs setup'}`);
  console.log(`Twilio: ${twilioOk ? '✅ Configured' : '❌ Needs setup'}`);
  console.log(`Admin Emails: ${adminEmails.length > 0 ? '✅' : '❌'} ${adminEmails.length} configured`);
  console.log(`Admin Phones: ${adminPhones.length > 0 ? '✅' : '❌'} ${adminPhones.length} configured`);
}

// Run diagnostics
runDiagnostics().catch(console.error);
