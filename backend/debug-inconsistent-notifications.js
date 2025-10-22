#!/usr/bin/env node

/**
 * Debug Inconsistent Notifications
 * Investigates why notifications work sometimes but not always
 */

require('dotenv').config();
const { notifyAdmins } = require('./utils/notifications');

console.log('🔍 Debugging Inconsistent Notifications');
console.log('=======================================');

// Test multiple notification attempts to identify patterns
async function testNotificationConsistency() {
  console.log('\n🧪 Testing Notification Consistency (10 attempts)...');
  console.log('====================================================');
  
  const results = [];
  
  for (let i = 1; i <= 10; i++) {
    console.log(`\n📱 Attempt ${i}/10:`);
    
    const testProblemData = {
      complaintId: `TEST${String(i).padStart(3, '0')}`,
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: `টেস্ট ${i} - নোটিফিকেশন কনসিস্টেন্সি চেক`,
      location: {
        address: `টেস্ট লোকেশন ${i}, ঢাকা`,
        coordinates: {
          latitude: 23.7281 + (i * 0.001),
          longitude: 90.3947 + (i * 0.001)
        }
      },
      userName: `টেস্ট ইউজার ${i}`,
      userPhone: '+8801712345678',
      userEmail: 'test@example.com',
      createdAt: new Date()
    };
    
    const startTime = Date.now();
    
    try {
      const result = await notifyAdmins(testProblemData);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      results.push({
        attempt: i,
        success: result.whatsapp || result.email,
        whatsapp: result.whatsapp,
        email: result.email,
        duration: duration,
        timestamp: new Date().toISOString()
      });
      
      console.log(`   WhatsApp: ${result.whatsapp ? '✅' : '❌'} | Email: ${result.email ? '✅' : '❌'} | Duration: ${duration}ms`);
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      results.push({
        attempt: i,
        success: false,
        whatsapp: false,
        email: false,
        duration: duration,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log(`   ❌ ERROR: ${error.message} | Duration: ${duration}ms`);
    }
    
    // Add delay between attempts to avoid rate limiting
    if (i < 10) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return results;
}

// Analyze the results for patterns
function analyzeResults(results) {
  console.log('\n📊 Analysis Results');
  console.log('===================');
  
  const totalAttempts = results.length;
  const successfulAttempts = results.filter(r => r.success).length;
  const whatsappSuccesses = results.filter(r => r.whatsapp).length;
  const emailSuccesses = results.filter(r => r.email).length;
  const errors = results.filter(r => r.error).length;
  
  console.log(`Total Attempts: ${totalAttempts}`);
  console.log(`Successful: ${successfulAttempts}/${totalAttempts} (${Math.round(successfulAttempts/totalAttempts*100)}%)`);
  console.log(`WhatsApp Success Rate: ${whatsappSuccesses}/${totalAttempts} (${Math.round(whatsappSuccesses/totalAttempts*100)}%)`);
  console.log(`Email Success Rate: ${emailSuccesses}/${totalAttempts} (${Math.round(emailSuccesses/totalAttempts*100)}%)`);
  console.log(`Errors: ${errors}/${totalAttempts} (${Math.round(errors/totalAttempts*100)}%)`);
  
  // Duration analysis
  const durations = results.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  
  console.log(`\nTiming Analysis:`);
  console.log(`Average Duration: ${Math.round(avgDuration)}ms`);
  console.log(`Fastest: ${minDuration}ms`);
  console.log(`Slowest: ${maxDuration}ms`);
  
  // Pattern detection
  console.log('\n🔍 Pattern Detection:');
  console.log('=====================');
  
  // Check for consecutive failures
  let consecutiveFailures = 0;
  let maxConsecutiveFailures = 0;
  for (const result of results) {
    if (!result.success) {
      consecutiveFailures++;
      maxConsecutiveFailures = Math.max(maxConsecutiveFailures, consecutiveFailures);
    } else {
      consecutiveFailures = 0;
    }
  }
  
  if (maxConsecutiveFailures > 1) {
    console.log(`⚠️  Found ${maxConsecutiveFailures} consecutive failures - possible rate limiting or service issues`);
  }
  
  // Check for slow responses
  const slowResponses = results.filter(r => r.duration > 10000); // > 10 seconds
  if (slowResponses.length > 0) {
    console.log(`⚠️  Found ${slowResponses.length} slow responses (>10s) - possible network issues`);
  }
  
  // Check error patterns
  const errorMessages = results.filter(r => r.error).map(r => r.error);
  const uniqueErrors = [...new Set(errorMessages)];
  if (uniqueErrors.length > 0) {
    console.log(`⚠️  Error types found:`);
    uniqueErrors.forEach(error => {
      const count = errorMessages.filter(e => e === error).length;
      console.log(`   - "${error}" (${count} times)`);
    });
  }
  
  return {
    successRate: successfulAttempts / totalAttempts,
    whatsappRate: whatsappSuccesses / totalAttempts,
    emailRate: emailSuccesses / totalAttempts,
    avgDuration,
    maxConsecutiveFailures,
    slowResponses: slowResponses.length,
    uniqueErrors
  };
}

// Provide recommendations based on analysis
function provideRecommendations(analysis) {
  console.log('\n💡 Recommendations');
  console.log('==================');
  
  if (analysis.successRate < 0.8) {
    console.log('🔴 LOW SUCCESS RATE (<80%)');
    console.log('- Check network connectivity');
    console.log('- Verify Twilio account status and credits');
    console.log('- Check for API rate limits');
  } else if (analysis.successRate < 0.95) {
    console.log('🟡 MODERATE SUCCESS RATE (80-95%)');
    console.log('- Some intermittent issues detected');
  } else {
    console.log('🟢 HIGH SUCCESS RATE (>95%)');
    console.log('- System is performing well');
  }
  
  if (analysis.whatsappRate < analysis.emailRate) {
    console.log('\n📱 WhatsApp Issues:');
    console.log('- Check Twilio WhatsApp sandbox status');
    console.log('- Verify admin phone numbers are still in sandbox');
    console.log('- Check for daily message limits');
  }
  
  if (analysis.emailRate < analysis.whatsappRate) {
    console.log('\n📧 Email Issues:');
    console.log('- Check email server credentials');
    console.log('- Verify SMTP server availability');
    console.log('- Check for email rate limits');
  }
  
  if (analysis.maxConsecutiveFailures > 2) {
    console.log('\n⚠️  Consecutive Failures Detected:');
    console.log('- Implement exponential backoff retry logic');
    console.log('- Add circuit breaker pattern');
    console.log('- Monitor external service health');
  }
  
  if (analysis.avgDuration > 5000) {
    console.log('\n⏱️  Slow Response Times:');
    console.log('- Check network latency to Twilio/email servers');
    console.log('- Consider implementing timeout handling');
    console.log('- Add async processing for notifications');
  }
  
  if (analysis.uniqueErrors.length > 0) {
    console.log('\n🐛 Error Handling:');
    console.log('- Implement better error recovery');
    console.log('- Add retry logic for transient failures');
    console.log('- Log errors for monitoring');
  }
}

// Main function
async function main() {
  try {
    const results = await testNotificationConsistency();
    const analysis = analyzeResults(results);
    provideRecommendations(analysis);
    
    // Save detailed results to file
    const fs = require('fs');
    const reportData = {
      timestamp: new Date().toISOString(),
      results,
      analysis,
      summary: {
        totalTests: results.length,
        successRate: `${Math.round(analysis.successRate * 100)}%`,
        whatsappRate: `${Math.round(analysis.whatsappRate * 100)}%`,
        emailRate: `${Math.round(analysis.emailRate * 100)}%`,
        avgDuration: `${Math.round(analysis.avgDuration)}ms`
      }
    };
    
    fs.writeFileSync('notification-consistency-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: notification-consistency-report.json');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
