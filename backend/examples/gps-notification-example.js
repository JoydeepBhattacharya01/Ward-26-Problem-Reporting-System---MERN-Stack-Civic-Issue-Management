#!/usr/bin/env node

/**
 * GPS Notification Example
 * Shows how GPS location is included in Twilio notifications
 */

console.log('🌍 GPS Location in Twilio Notifications - Example');
console.log('================================================');

// Example of how GPS data is structured in your system
const problemDataWithGPS = {
  complaintId: 'CMP1001',
  category: 'electricity',
  subcategory: 'বিদ্যুৎ বিভ্রাট',
  description: 'রাস্তার আলো জ্বলছে না',
  location: {
    address: 'ঢাকা বিশ্ববিদ্যালয়, ঢাকা',
    coordinates: {
      latitude: 23.7281,
      longitude: 90.3947
    }
  },
  userName: 'জন ডো',
  userPhone: '+8801712345678',
  createdAt: new Date()
};

// Example WhatsApp message format with GPS
console.log('\n📱 WhatsApp Message with GPS:');
console.log('=============================');
console.log(`🔔 *২৬ নম্বর ওয়ার্ড - নতুন সমস্যা রিপোর্ট*

📋 *ক্যাটাগরি:* বিদ্যুৎ সমস্যা
📌 *সাব-ক্যাটাগরি:* ${problemDataWithGPS.subcategory}
📝 *বিবরণ:* ${problemDataWithGPS.description}
📍 *অবস্থান:* ${problemDataWithGPS.location.address}
🌍 *GPS স্থানাঙ্ক:* ${problemDataWithGPS.location.coordinates.latitude.toFixed(6)}, ${problemDataWithGPS.location.coordinates.longitude.toFixed(6)}
📱 *Google Maps:* https://www.google.com/maps?q=${problemDataWithGPS.location.coordinates.latitude},${problemDataWithGPS.location.coordinates.longitude}

👤 *রিপোর্টকারীর তথ্য:*
নাম: ${problemDataWithGPS.userName}
মোবাইল: ${problemDataWithGPS.userPhone}

🕐 *সময়:* ${problemDataWithGPS.createdAt.toLocaleString('bn-BD')}`);

// Example SMS message format with GPS
console.log('\n📱 SMS Message with GPS:');
console.log('=======================');
console.log(`🔔 New Complaint - Ward 26
ID: ${problemDataWithGPS.complaintId}
Category: বিদ্যুৎ সমস্যা
Location: ${problemDataWithGPS.location.address}
GPS: ${problemDataWithGPS.location.coordinates.latitude.toFixed(4)}, ${problemDataWithGPS.location.coordinates.longitude.toFixed(4)}
Maps: https://www.google.com/maps?q=${problemDataWithGPS.location.coordinates.latitude},${problemDataWithGPS.location.coordinates.longitude}
Reporter: ${problemDataWithGPS.userName} (${problemDataWithGPS.userPhone})
Time: ${problemDataWithGPS.createdAt.toLocaleString()}`);

console.log('\n✨ GPS Features Implemented:');
console.log('============================');
console.log('✅ GPS coordinates captured from user\'s device');
console.log('✅ Coordinates included in WhatsApp notifications');
console.log('✅ Coordinates included in SMS notifications');  
console.log('✅ Coordinates included in email notifications');
console.log('✅ Google Maps links generated automatically');
console.log('✅ Graceful handling when GPS is not available');
console.log('✅ Works with existing Twilio WhatsApp sandbox');

console.log('\n🔧 How it works:');
console.log('================');
console.log('1. User clicks "GPS ব্যবহার করুন" button in frontend');
console.log('2. Browser requests location permission');
console.log('3. GPS coordinates are captured and stored');
console.log('4. When problem is submitted, coordinates are sent to backend');
console.log('5. Notifications include GPS data and Google Maps links');
console.log('6. Admins can click the link to see exact location on map');

console.log('\n📍 Example Google Maps Link:');
console.log('============================');
console.log(`https://www.google.com/maps?q=${problemDataWithGPS.location.coordinates.latitude},${problemDataWithGPS.location.coordinates.longitude}`);
console.log('👆 This link opens the exact location in Google Maps');
