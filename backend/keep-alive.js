/**
 * Keep-Alive Script for Ward 26 Problem Reporting System
 * 
 * This script can be used to:
 * 1. Test the keep-alive endpoint locally
 * 2. Run as a standalone service to ping the backend
 * 
 * For production, use a cron service like:
 * - cron-job.org (free, reliable)
 * - UptimeRobot (free tier available)
 * - Better Uptime
 */

const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://ward-26-problem-reporting-system-mern.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes (in milliseconds)
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

/**
 * Ping the backend health endpoint
 */
async function pingBackend() {
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`${colors.blue}[${timestamp}] Pinging backend...${colors.reset}`);
    
    const response = await axios.get(HEALTH_ENDPOINT, {
      timeout: 30000 // 30 second timeout
    });
    
    const data = response.data || {};
    const { status, database, uptime } = data;
    
    if (status === 'OK' && database && database.status === 'connected') {
      console.log(`${colors.green}✅ Backend is healthy${colors.reset}`);
      console.log(`   - Status: ${status}`);
      console.log(`   - Database: ${database.status}`);
      console.log(`   - Uptime: ${uptime ? Math.floor(uptime / 60) : 0} minutes`);
      return true;
    } else if (status === 'OK') {
      console.log(`${colors.green}✅ Backend is responding${colors.reset}`);
      console.log(`   - Status: ${status}`);
      if (database) {
        console.log(`   - Database: ${database.status || 'unknown'}`);
      }
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  Backend is degraded${colors.reset}`);
      console.log(`   - Status: ${status || 'unknown'}`);
      if (database) {
        console.log(`   - Database: ${database.status || 'unknown'}`);
      }
      return false;
    }
  } catch (error) {
    console.error(`${colors.red}❌ Failed to ping backend${colors.reset}`);
    
    if (error.code === 'ECONNABORTED') {
      console.error('   - Reason: Request timeout');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('   - Reason: Cannot reach server');
    } else if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error(`   - Error: ${error.message}`);
    }
    
    return false;
  }
}

/**
 * Start the keep-alive service
 */
async function startKeepAlive() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Ward 26 Keep-Alive Service                                ║
║  Backend: ${BACKEND_URL.padEnd(40)} ║
║  Interval: ${(PING_INTERVAL / 60000)} minutes${' '.repeat(44)} ║
╚════════════════════════════════════════════════════════════╝
  `);

  // Initial ping
  await pingBackend();

  // Set up interval for continuous pinging
  setInterval(async () => {
    await pingBackend();
  }, PING_INTERVAL);

  console.log(`\n${colors.blue}Keep-alive service is running...${colors.reset}`);
  console.log(`Press Ctrl+C to stop\n`);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down keep-alive service...${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}Shutting down keep-alive service...${colors.reset}`);
  process.exit(0);
});

// Start the service if run directly
if (require.main === module) {
  startKeepAlive().catch(error => {
    console.error(`${colors.red}Failed to start keep-alive service:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = { pingBackend };
