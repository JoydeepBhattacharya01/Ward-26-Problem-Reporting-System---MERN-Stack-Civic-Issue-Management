#!/usr/bin/env node

// Environment Configuration Helper
// This script helps you update your .env file with correct values

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateEnvFile() {
  console.log('🔧 Ward 26 Environment Configuration Helper\n');
  console.log('This script will help you update your .env file with correct values.\n');
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    process.exit(1);
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('📧 Email Configuration:');
  console.log('Current EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
  
  if (process.env.EMAIL_USER === 'your_email@gmail.com' || !process.env.EMAIL_USER) {
    const emailUser = await question('Enter your Gmail address (e.g., yourname@gmail.com): ');
    if (emailUser.trim()) {
      envContent = envContent.replace(
        /EMAIL_USER=.*/,
        `EMAIL_USER=${emailUser.trim()}`
      );
      console.log('✅ EMAIL_USER updated');
    }
  }
  
  if (process.env.EMAIL_PASSWORD === 'your_app_password_here' || !process.env.EMAIL_PASSWORD) {
    console.log('\n📝 Gmail App Password Setup:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Factor Authentication if not already enabled');
    console.log('3. Go to "2-Step Verification" → "App passwords"');
    console.log('4. Generate a new app password for "Mail"');
    console.log('5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)');
    
    const emailPassword = await question('\nEnter your Gmail App Password (16 characters): ');
    if (emailPassword.trim() && emailPassword.length >= 16) {
      envContent = envContent.replace(
        /EMAIL_PASSWORD=.*/,
        `EMAIL_PASSWORD=${emailPassword.trim().replace(/\s/g, '')}`
      );
      console.log('✅ EMAIL_PASSWORD updated');
    } else {
      console.log('⚠️  Invalid app password format. Please ensure it\'s 16 characters.');
    }
  }
  
  console.log('\n📱 Twilio Configuration:');
  console.log('Current TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || 'Not set');
  
  if (process.env.TWILIO_PHONE_NUMBER === '+1234567890' || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('\n📞 Twilio Phone Number Setup:');
    console.log('1. Go to your Twilio Console: https://console.twilio.com/');
    console.log('2. Go to Phone Numbers → Manage → Active numbers');
    console.log('3. Copy your Twilio phone number (format: +1234567890)');
    
    const twilioPhone = await question('\nEnter your Twilio phone number (with + and country code): ');
    if (twilioPhone.trim() && twilioPhone.startsWith('+')) {
      envContent = envContent.replace(
        /TWILIO_PHONE_NUMBER=.*/,
        `TWILIO_PHONE_NUMBER=${twilioPhone.trim()}`
      );
      console.log('✅ TWILIO_PHONE_NUMBER updated');
    } else {
      console.log('⚠️  Invalid phone number format. Please include + and country code.');
    }
  }
  
  // Write updated content
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file updated successfully!');
  
  console.log('\n🔄 Next steps:');
  console.log('1. Restart your backend server');
  console.log('2. Run: node test-notifications.js');
  console.log('3. Test by submitting a problem report');
  
  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Configuration cancelled.');
  rl.close();
  process.exit(0);
});

updateEnvFile().catch(console.error);
