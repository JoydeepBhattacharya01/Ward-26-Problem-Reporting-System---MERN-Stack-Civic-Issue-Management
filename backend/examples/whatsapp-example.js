/**
 * WhatsApp Notification Example
 * 
 * This file demonstrates how to use the WhatsApp notification system
 * to send messages to admins when users submit complaints.
 */

require('dotenv').config();
const { sendWhatsApp, sendWhatsAppNotification, notifyAdmins } = require('../utils/notifications');

// Example 1: Send a simple WhatsApp message to a single admin
async function example1_sendToSingleAdmin() {
  console.log('\n=== Example 1: Send to Single Admin ===');
  
  try {
    const adminPhone = '+8801712345678'; // Replace with actual admin number
    const message = 'Hello! This is a test WhatsApp message from Ward 26 system.';
    
    const result = await sendWhatsApp(adminPhone, message);
    
    if (result.success) {
      console.log('✅ Message sent successfully!');
      console.log('Message SID:', result.sid);
    } else {
      console.log('❌ Failed to send message');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Send formatted WhatsApp message with Bengali text
async function example2_sendFormattedMessage() {
  console.log('\n=== Example 2: Send Formatted Message ===');
  
  try {
    const adminPhone = '+8801712345678'; // Replace with actual admin number
    
    // WhatsApp supports markdown formatting
    const message = `🔔 *ওয়ার্ড ২৬ - গুরুত্বপূর্ণ বিজ্ঞপ্তি*

📋 *বিষয়:* জরুরি সমস্যা
📍 *স্থান:* ঢাকা, বাংলাদেশ
⏰ *সময়:* ${new Date().toLocaleString('bn-BD')}

_এটি একটি পরীক্ষামূলক বার্তা_`;
    
    const result = await sendWhatsApp(adminPhone, message);
    
    if (result.success) {
      console.log('✅ Formatted message sent successfully!');
    } else {
      console.log('❌ Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Send notification to all admins when user submits a problem
async function example3_notifyAllAdmins() {
  console.log('\n=== Example 3: Notify All Admins ===');
  
  try {
    // Simulate a problem report from a user
    const problemData = {
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: 'এলাকায় গত ৩ ঘণ্টা ধরে বিদ্যুৎ নেই। জরুরি ভিত্তিতে সমাধান প্রয়োজন।',
      location: {
        address: 'মিরপুর ১০, ঢাকা',
        coordinates: [90.3563, 23.8069]
      },
      pollNumber: 'POLE-12345',
      userName: 'মোঃ রহিম',
      userPhone: '+8801812345678',
      userEmail: 'rahim@example.com',
      createdAt: new Date()
    };
    
    // Send WhatsApp notification to all configured admins
    const success = await sendWhatsAppNotification(problemData);
    
    if (success) {
      console.log('✅ WhatsApp notifications sent to all admins!');
    } else {
      console.log('❌ Failed to send notifications');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: Send both email and WhatsApp notifications
async function example4_sendBothNotifications() {
  console.log('\n=== Example 4: Send Email + WhatsApp ===');
  
  try {
    const problemData = {
      category: 'drainage',
      subcategory: 'নর্দমা বন্ধ',
      description: 'রাস্তায় পানি জমে আছে। নর্দমা পরিষ্কার করা প্রয়োজন।',
      location: {
        address: 'গুলশান ২, ঢাকা',
        coordinates: [90.4125, 23.7925]
      },
      userName: 'করিম আহমেদ',
      userPhone: '+8801912345678',
      userEmail: 'karim@example.com',
      createdAt: new Date()
    };
    
    // This will send both email and WhatsApp notifications
    const results = await notifyAdmins(problemData);
    
    console.log('Notification Results:');
    console.log('- Email:', results.email ? '✅ Sent' : '❌ Failed');
    console.log('- WhatsApp:', results.whatsapp ? '✅ Sent' : '❌ Failed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 5: Send to multiple specific admins (custom list)
async function example5_sendToMultipleAdmins() {
  console.log('\n=== Example 5: Send to Multiple Specific Admins ===');
  
  try {
    const adminNumbers = [
      '+8801712345678',
      '+8801812345678',
      '+8801912345678'
    ];
    
    const message = `🚨 *জরুরি বিজ্ঞপ্তি*

নতুন সমস্যা রিপোর্ট করা হয়েছে। অনুগ্রহ করে দ্রুত ব্যবস্থা নিন।

ধন্যবাদ,
ওয়ার্ড ২৬ টিম`;
    
    // Send to each admin
    const promises = adminNumbers.map(phone => sendWhatsApp(phone, message));
    const results = await Promise.all(promises);
    
    // Count successes and failures
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`✅ Sent to ${successCount} admins`);
    console.log(`❌ Failed for ${failCount} admins`);
    
    // Show details
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`  ✓ ${adminNumbers[index]}: ${result.sid}`);
      } else {
        console.log(`  ✗ ${adminNumbers[index]}: ${result.error}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 6: Error handling and retry logic
async function example6_withRetry() {
  console.log('\n=== Example 6: Send with Retry Logic ===');
  
  const sendWithRetry = async (phone, message, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} for ${phone}`);
        const result = await sendWhatsApp(phone, message);
        
        if (result.success) {
          console.log(`✅ Success on attempt ${attempt}`);
          return result;
        }
        
        if (attempt < maxRetries) {
          console.log(`Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
    throw new Error('All retry attempts failed');
  };
  
  try {
    const adminPhone = '+8801712345678';
    const message = 'Test message with retry logic';
    
    await sendWithRetry(adminPhone, message);
  } catch (error) {
    console.error('Final error:', error.message);
  }
}

// Main function to run all examples
async function runExamples() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   WhatsApp Notification Examples - Ward 26    ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  console.log('\n⚠️  IMPORTANT: Before running these examples:');
  console.log('1. Set up your .env file with Twilio credentials');
  console.log('2. Join the WhatsApp sandbox from all admin numbers');
  console.log('3. Replace example phone numbers with real ones');
  console.log('4. Uncomment the example you want to run\n');
  
  // Uncomment the example you want to run:
  
  // await example1_sendToSingleAdmin();
  // await example2_sendFormattedMessage();
  await example3_notifyAllAdmins();  // ✅ Testing all admins
  // await example4_sendBothNotifications();
  // await example5_sendToMultipleAdmins();
  // await example6_withRetry();
  
  console.log('\n✨ Examples completed!');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

// Export functions for use in other files
module.exports = {
  example1_sendToSingleAdmin,
  example2_sendFormattedMessage,
  example3_notifyAllAdmins,
  example4_sendBothNotifications,
  example5_sendToMultipleAdmins,
  example6_withRetry
};
