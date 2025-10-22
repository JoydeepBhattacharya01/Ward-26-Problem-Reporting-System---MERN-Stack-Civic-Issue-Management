#!/usr/bin/env node

/**
 * New Twilio Account Configuration Helper
 * Helps configure and test new Twilio account setup
 */

require('dotenv').config();
const twilio = require('twilio');

async function configureNewTwilioAccount() {
  console.log('🔧 New Twilio Account Configuration Helper');
  console.log('==========================================\n');

  // Check if new credentials are set
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.log('❌ Missing Twilio credentials in .env file');
    console.log('Please ensure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set\n');
    return;
  }

  console.log('📋 Current Twilio Configuration:');
  console.log(`Account SID: ${accountSid}`);
  console.log(`Auth Token: ${authToken.substring(0, 8)}...`);
  console.log('');

  try {
    // Initialize Twilio client
    const client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');

    // Test account access
    console.log('\n🔍 Testing account access...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log(`✅ Account Status: ${account.status}`);
    console.log(`✅ Account Type: ${account.type}`);
    console.log(`✅ Account Name: ${account.friendlyName}`);

    // Get account balance (if available)
    try {
      const balance = await client.api.accounts(accountSid).balance.fetch();
      console.log(`💰 Account Balance: ${balance.balance} ${balance.currency}`);
    } catch (balanceError) {
      console.log('💰 Account Balance: Not available (trial account)');
    }

    // List available phone numbers
    console.log('\n📱 Available Phone Numbers:');
    const phoneNumbers = await client.incomingPhoneNumbers.list({ limit: 10 });
    
    if (phoneNumbers.length === 0) {
      console.log('⚠️  No phone numbers found in account');
      console.log('🔧 You need to purchase a phone number for SMS functionality');
      console.log('   Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/search');
    } else {
      phoneNumbers.forEach((number, index) => {
        console.log(`${index + 1}. ${number.phoneNumber} (${number.friendlyName || 'Unnamed'})`);
        console.log(`   Capabilities: SMS=${number.capabilities.sms}, Voice=${number.capabilities.voice}`);
      });

      // Update .env recommendation
      const recommendedNumber = phoneNumbers[0].phoneNumber;
      console.log(`\n💡 Recommended .env update:`);
      console.log(`TWILIO_PHONE_NUMBER=${recommendedNumber}`);
    }

    // Check WhatsApp sandbox
    console.log('\n📲 WhatsApp Sandbox Configuration:');
    try {
      // Try to get WhatsApp sandbox info
      const sandboxNumber = '+14155238886'; // Default Twilio WhatsApp sandbox
      console.log(`WhatsApp Sandbox Number: ${sandboxNumber}`);
      console.log('🔧 To activate WhatsApp for admin phones:');
      console.log(`   1. Send "join <your-sandbox-keyword>" to ${sandboxNumber}`);
      console.log('   2. Do this for each admin phone number');
      console.log('   3. Find your sandbox keyword at: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
      
      console.log(`\n💡 Recommended .env update:`);
      console.log(`TWILIO_WHATSAPP_NUMBER=${sandboxNumber}`);
    } catch (whatsappError) {
      console.log('⚠️  WhatsApp sandbox info not available');
    }

    // Test SMS capability
    console.log('\n🧪 SMS Test Configuration:');
    const adminPhones = [
      process.env.ADMIN_PHONE_1,
      process.env.ADMIN_PHONE_2,
      process.env.ADMIN_PHONE_3
    ].filter(phone => phone);

    if (adminPhones.length === 0) {
      console.log('⚠️  No admin phone numbers configured');
      console.log('Please set ADMIN_PHONE_1, ADMIN_PHONE_2, ADMIN_PHONE_3 in .env');
    } else {
      console.log('Admin phone numbers configured:');
      adminPhones.forEach((phone, index) => {
        const isValid = /^\+[1-9]\d{1,14}$/.test(phone);
        console.log(`${index + 1}. ${phone} ${isValid ? '✅' : '❌ Invalid E.164 format'}`);
      });
    }

    // Provide next steps
    console.log('\n📝 Next Steps for New Twilio Account:');
    console.log('1. ✅ Account connection verified');
    
    if (phoneNumbers.length === 0) {
      console.log('2. 🛒 Purchase a phone number for SMS:');
      console.log('   - Go to Twilio Console > Phone Numbers > Buy a number');
      console.log('   - Choose a number with SMS capability');
      console.log('   - Update TWILIO_PHONE_NUMBER in .env');
    } else {
      console.log('2. ✅ Phone number available for SMS');
    }
    
    console.log('3. 📲 Configure WhatsApp Sandbox:');
    console.log('   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
    console.log('   - Note your sandbox keyword');
    console.log('   - Send "join <keyword>" from each admin phone to +14155238886');
    
    console.log('4. 🧪 Test notifications:');
    console.log('   - Run: node test-notifications-fixed.js');
    console.log('   - Submit a test problem report');

    return {
      success: true,
      accountStatus: account.status,
      phoneNumbers: phoneNumbers.length,
      recommendations: {
        phoneNumber: phoneNumbers.length > 0 ? phoneNumbers[0].phoneNumber : null,
        whatsappNumber: '+14155238886'
      }
    };

  } catch (error) {
    console.log(`❌ Error testing new Twilio account: ${error.message}`);
    
    if (error.code === 20003) {
      console.log('💡 This usually means invalid Account SID or Auth Token');
      console.log('   Please double-check your credentials in the .env file');
    }
    
    return { success: false, error: error.message };
  }
}

// Auto-update .env file with recommendations
async function updateEnvFile(recommendations) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    let updated = false;
    
    // Update phone number if available and not set
    if (recommendations.phoneNumber && !process.env.TWILIO_PHONE_NUMBER) {
      if (envContent.includes('TWILIO_PHONE_NUMBER=')) {
        envContent = envContent.replace(
          /TWILIO_PHONE_NUMBER=.*/,
          `TWILIO_PHONE_NUMBER=${recommendations.phoneNumber}`
        );
      } else {
        envContent += `\nTWILIO_PHONE_NUMBER=${recommendations.phoneNumber}`;
      }
      updated = true;
    }
    
    // Update WhatsApp number if not set
    if (recommendations.whatsappNumber && !process.env.TWILIO_WHATSAPP_NUMBER) {
      if (envContent.includes('TWILIO_WHATSAPP_NUMBER=')) {
        envContent = envContent.replace(
          /TWILIO_WHATSAPP_NUMBER=.*/,
          `TWILIO_WHATSAPP_NUMBER=${recommendations.whatsappNumber}`
        );
      } else {
        envContent += `\nTWILIO_WHATSAPP_NUMBER=${recommendations.whatsappNumber}`;
      }
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ .env file updated with recommended settings');
      console.log('🔄 Please restart your server to apply changes');
    }
    
  } catch (error) {
    console.log(`⚠️  Could not auto-update .env file: ${error.message}`);
  }
}

// Run configuration if this file is executed directly
if (require.main === module) {
  configureNewTwilioAccount()
    .then(async (result) => {
      if (result.success && result.recommendations) {
        await updateEnvFile(result.recommendations);
      }
    })
    .catch(console.error);
}

module.exports = { configureNewTwilioAccount };
