#!/usr/bin/env node

/**
 * Port Manager - Handles port conflicts automatically
 * Finds available ports and manages multiple instances
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Default ports for frontend and backend
const DEFAULT_FRONTEND_PORT = 3000;
const DEFAULT_BACKEND_PORT = 8000;
const PORT_RANGE_START = 3001;
const PORT_RANGE_END = 9000;

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      // If lsof returns no output, port is available
      resolve(!stdout.trim());
    });
  });
}

/**
 * Find next available port starting from a given port
 */
async function findAvailablePort(startPort = PORT_RANGE_START) {
  for (let port = startPort; port <= PORT_RANGE_END; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports found in range ${startPort}-${PORT_RANGE_END}`);
}

/**
 * Kill process running on a specific port
 */
function killPortProcess(port) {
  return new Promise((resolve, reject) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (!stdout.trim()) {
        console.log(`✅ Port ${port} is already free`);
        resolve();
        return;
      }

      const pid = stdout.trim();
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          reject(new Error(`Failed to kill process ${pid} on port ${port}: ${killError.message}`));
        } else {
          console.log(`✅ Killed process ${pid} on port ${port}`);
          resolve();
        }
      });
    });
  });
}

/**
 * Update package.json with new port
 */
function updatePackageJsonPort(packagePath, port) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Update start script to use specific port
    if (packageJson.scripts && packageJson.scripts.start) {
      // For React apps, set PORT environment variable
      packageJson.scripts.start = `PORT=${port} react-scripts start`;
    }
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated ${packagePath} to use port ${port}`);
  } catch (error) {
    console.log(`⚠️  Could not update ${packagePath}: ${error.message}`);
  }
}

/**
 * Update .env file with new ports
 */
function updateEnvFile(envPath, frontendPort, backendPort) {
  try {
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add PORT
    if (envContent.includes('PORT=')) {
      envContent = envContent.replace(/PORT=\d+/, `PORT=${backendPort}`);
    } else {
      envContent += `\nPORT=${backendPort}`;
    }
    
    // Update or add FRONTEND_URL
    if (envContent.includes('FRONTEND_URL=')) {
      envContent = envContent.replace(/FRONTEND_URL=.*/, `FRONTEND_URL=http://localhost:${frontendPort}`);
    } else {
      envContent += `\nFRONTEND_URL=http://localhost:${frontendPort}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated ${envPath} with ports - Frontend: ${frontendPort}, Backend: ${backendPort}`);
  } catch (error) {
    console.log(`⚠️  Could not update ${envPath}: ${error.message}`);
  }
}

/**
 * Main port management function
 */
async function managePortsAndStart() {
  console.log('🔧 Ward 26 Port Manager');
  console.log('=======================\n');

  try {
    // Check current port status
    console.log('🔍 Checking port availability...');
    const frontendAvailable = await isPortAvailable(DEFAULT_FRONTEND_PORT);
    const backendAvailable = await isPortAvailable(DEFAULT_BACKEND_PORT);

    console.log(`Frontend port ${DEFAULT_FRONTEND_PORT}: ${frontendAvailable ? '✅ Available' : '❌ In use'}`);
    console.log(`Backend port ${DEFAULT_BACKEND_PORT}: ${backendAvailable ? '✅ Available' : '❌ In use'}`);

    let frontendPort = DEFAULT_FRONTEND_PORT;
    let backendPort = DEFAULT_BACKEND_PORT;

    // Handle frontend port conflict
    if (!frontendAvailable) {
      console.log(`\n🔄 Finding alternative port for frontend...`);
      frontendPort = await findAvailablePort(3001);
      console.log(`✅ Found available frontend port: ${frontendPort}`);
    }

    // Handle backend port conflict
    if (!backendAvailable) {
      console.log(`\n🔄 Finding alternative port for backend...`);
      backendPort = await findAvailablePort(8001);
      console.log(`✅ Found available backend port: ${backendPort}`);
    }

    // Update configuration files
    console.log('\n📝 Updating configuration files...');
    
    // Update frontend package.json
    const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
    if (fs.existsSync(frontendPackagePath)) {
      updatePackageJsonPort(frontendPackagePath, frontendPort);
    }

    // Update backend .env
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    updateEnvFile(backendEnvPath, frontendPort, backendPort);

    // Update frontend proxy if needed
    const frontendPackageJson = path.join(__dirname, 'frontend', 'package.json');
    if (fs.existsSync(frontendPackageJson)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(frontendPackageJson, 'utf8'));
        if (packageData.proxy) {
          packageData.proxy = `http://localhost:${backendPort}`;
          fs.writeFileSync(frontendPackageJson, JSON.stringify(packageData, null, 2));
          console.log(`✅ Updated frontend proxy to point to backend port ${backendPort}`);
        }
      } catch (error) {
        console.log(`⚠️  Could not update frontend proxy: ${error.message}`);
      }
    }

    console.log('\n🚀 Configuration Summary:');
    console.log(`Frontend will run on: http://localhost:${frontendPort}`);
    console.log(`Backend will run on: http://localhost:${backendPort}`);

    console.log('\n📋 Next Steps:');
    console.log('1. Start backend: cd backend && npm start');
    console.log('2. Start frontend: cd frontend && npm start');
    console.log('3. Or use: npm run dev (if you have a dev script)');

    return { frontendPort, backendPort };

  } catch (error) {
    console.error('❌ Error managing ports:', error.message);
    process.exit(1);
  }
}

/**
 * Kill processes and clean up ports
 */
async function cleanupPorts() {
  console.log('🧹 Cleaning up ports...');
  
  try {
    await killPortProcess(3000);
    await killPortProcess(8000);
    console.log('✅ Port cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

// Command line interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'cleanup':
    case 'clean':
      cleanupPorts();
      break;
    case 'kill':
      if (process.argv[3]) {
        killPortProcess(parseInt(process.argv[3]));
      } else {
        console.log('Usage: node port-manager.js kill <port>');
      }
      break;
    default:
      managePortsAndStart();
  }
}

module.exports = {
  managePortsAndStart,
  cleanupPorts,
  killPortProcess,
  findAvailablePort,
  isPortAvailable
};
