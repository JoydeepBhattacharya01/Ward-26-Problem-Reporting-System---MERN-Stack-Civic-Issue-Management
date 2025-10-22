#!/usr/bin/env node

/**
 * Quick Port Conflict Fix
 * Kills processes on ports 3000 and 8000, then configures the app
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function killProcess(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (!stdout.trim()) {
        console.log(`✅ Port ${port} is already free`);
        resolve();
        return;
      }

      const pid = stdout.trim();
      console.log(`🔄 Killing process ${pid} on port ${port}...`);
      
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          console.log(`⚠️  Could not kill process on port ${port}: ${killError.message}`);
        } else {
          console.log(`✅ Successfully freed port ${port}`);
        }
        resolve();
      });
    });
  });
}

async function fixPortConflicts() {
  console.log('🔧 Ward 26 Port Conflict Fix');
  console.log('============================\n');

  console.log('🔍 Checking and freeing ports...');
  
  // Kill processes on both ports
  await killProcess(3000);
  await killProcess(8000);

  console.log('\n📝 Updating configuration...');

  // Update frontend package.json to ensure correct proxy
  const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
  if (fs.existsSync(frontendPackagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
      packageJson.proxy = 'http://localhost:8000';
      fs.writeFileSync(frontendPackagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated frontend proxy configuration');
    } catch (error) {
      console.log(`⚠️  Could not update frontend package.json: ${error.message}`);
    }
  }

  // Update backend .env to ensure correct ports
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    try {
      let envContent = fs.readFileSync(backendEnvPath, 'utf8');
      
      // Ensure PORT is set to 8000
      if (envContent.includes('PORT=')) {
        envContent = envContent.replace(/PORT=\d+/, 'PORT=8000');
      } else {
        envContent += '\nPORT=8000';
      }
      
      // Ensure FRONTEND_URL is set correctly
      if (envContent.includes('FRONTEND_URL=')) {
        envContent = envContent.replace(/FRONTEND_URL=.*/, 'FRONTEND_URL=http://localhost:3000');
      } else {
        envContent += '\nFRONTEND_URL=http://localhost:3000';
      }
      
      fs.writeFileSync(backendEnvPath, envContent);
      console.log('✅ Updated backend .env configuration');
    } catch (error) {
      console.log(`⚠️  Could not update backend .env: ${error.message}`);
    }
  }

  console.log('\n🚀 Ports are now free! You can start your application:');
  console.log('');
  console.log('Option 1 - Start both servers:');
  console.log('  ./start-app.sh');
  console.log('');
  console.log('Option 2 - Start manually:');
  console.log('  Terminal 1: cd backend && npm start');
  console.log('  Terminal 2: cd frontend && npm start');
  console.log('');
  console.log('🌐 Your app will be available at:');
  console.log('  Frontend: http://localhost:3000');
  console.log('  Backend: http://localhost:8000');
}

// Also create a simple package.json script updater
function createDevScript() {
  const rootPackagePath = path.join(__dirname, 'package.json');
  
  let packageJson = {};
  if (fs.existsSync(rootPackagePath)) {
    packageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.dev = 'concurrently "cd backend && npm start" "cd frontend && npm start"';
  packageJson.scripts['fix-ports'] = 'node fix-port-conflict.js';
  packageJson.scripts['start-app'] = './start-app.sh';

  fs.writeFileSync(rootPackagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added convenience scripts to package.json');
}

if (require.main === module) {
  fixPortConflicts().then(() => {
    createDevScript();
  }).catch(console.error);
}

module.exports = { fixPortConflicts };
