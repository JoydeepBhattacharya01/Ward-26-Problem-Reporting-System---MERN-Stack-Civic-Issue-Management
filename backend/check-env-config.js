#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Helps verify .env file is properly loaded
 */

require('dotenv').config();

console.log('🔍 Environment Configuration Check');
console.log('==================================\n');

console.log('📧 Email Configuration:');
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'SET (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'NOT SET'}`);

console.log('\n📱 Twilio Configuration:');
console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID || 'NOT SET'}`);
console.log(`TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? 'SET (starts with: ' + process.env.TWILIO_AUTH_TOKEN.substring(0, 8) + '...)' : 'NOT SET'}`);
console.log(`TWILIO_PHONE_NUMBER: ${process.env.TWILIO_PHONE_NUMBER || 'NOT SET'}`);
console.log(`TWILIO_WHATSAPP_NUMBER: ${process.env.TWILIO_WHATSAPP_NUMBER || 'NOT SET'}`);

console.log('\n👥 Admin Configuration:');
console.log(`ADMIN_EMAIL_1: ${process.env.ADMIN_EMAIL_1 || 'NOT SET'}`);
console.log(`ADMIN_EMAIL_2: ${process.env.ADMIN_EMAIL_2 || 'NOT SET'}`);
console.log(`ADMIN_EMAIL_3: ${process.env.ADMIN_EMAIL_3 || 'NOT SET'}`);
console.log(`ADMIN_PHONE_1: ${process.env.ADMIN_PHONE_1 || 'NOT SET'}`);
console.log(`ADMIN_PHONE_2: ${process.env.ADMIN_PHONE_2 || 'NOT SET'}`);
console.log(`ADMIN_PHONE_3: ${process.env.ADMIN_PHONE_3 || 'NOT SET'}`);

console.log('\n🔧 Issues Detected:');
const issues = [];

// Check email configuration
if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
  issues.push('❌ EMAIL_USER not properly set (still has placeholder value)');
}

if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.length < 16) {
  issues.push('❌ EMAIL_PASSWORD not set or too short (Gmail App Password should be 16 characters)');
}

// Check Twilio configuration
if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.startsWith('your_')) {
  issues.push('❌ TWILIO_ACCOUNT_SID not properly set');
}

if (!process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN.startsWith('your_')) {
  issues.push('❌ TWILIO_AUTH_TOKEN not properly set');
}

if (!process.env.TWILIO_PHONE_NUMBER) {
  issues.push('⚠️  TWILIO_PHONE_NUMBER not set (needed for SMS)');
}

// Check admin configuration
if (!process.env.ADMIN_EMAIL_1 || process.env.ADMIN_EMAIL_1.includes('example.com')) {
  issues.push('❌ ADMIN_EMAIL_1 not properly set');
}

if (issues.length === 0) {
  console.log('✅ All configurations look good!');
} else {
  issues.forEach(issue => console.log(issue));
}

console.log('\n💡 Next Steps:');
// Check if using trial account with daily limits
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  console.log('ℹ️  Using Twilio account:', process.env.TWILIO_ACCOUNT_SID.substring(0, 8) + '...');
  console.log('   If you hit daily limits, consider upgrading your Twilio account');
}

if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.length < 16) {
  console.log('📧 Set up Gmail App Password:');
  console.log('   1. Go to https://myaccount.google.com/apppasswords');
  console.log('   2. Generate new App Password');
  console.log('   3. Update EMAIL_PASSWORD in .env file');
}

console.log('\n🔄 After making changes:');
console.log('1. Save the .env file');
console.log('2. Restart your server');
console.log('3. Run: node test-notification-now.js');
