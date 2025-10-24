#!/usr/bin/env node

/**
 * Startup Validation Script
 * Validates all critical configurations before server starts
 * Run this before deploying to catch issues early
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting pre-flight validation...\n');

let hasErrors = false;
let hasWarnings = false;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function error(message) {
  console.log(`${colors.red}❌ ERROR: ${message}${colors.reset}`);
  hasErrors = true;
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  WARNING: ${message}${colors.reset}`);
  hasWarnings = true;
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// 1. Check environment configuration
console.log('📋 Checking environment configuration...');
const envPath = path.join(__dirname, '.env');

// Load .env if it exists (local development), otherwise use injected env vars (production)
if (fs.existsSync(envPath)) {
  success('.env file exists (local development)');
  require('dotenv').config();
} else {
  info('No .env file found - using environment variables (production mode)');
}

// Validate environment variables (works for both local and production)
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'FRONTEND_URL'
];

const optionalVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'ADMIN_PHONE_1'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    error(`Required environment variable ${varName} is not set`);
  } else {
    success(`${varName} is configured`);
  }
});

optionalVars.forEach(varName => {
  if (!process.env[varName]) {
    warning(`Optional variable ${varName} is not set (notifications may not work)`);
  } else {
    success(`${varName} is configured`);
  }
});

// 2. Check package.json and dependencies
console.log('\n📦 Checking dependencies...');
const packagePath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packagePath)) {
  error('package.json not found');
} else {
  success('package.json exists');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    error('node_modules not found. Run: npm install');
  } else {
    success('node_modules directory exists');
    
    // Check critical dependencies
    const criticalDeps = [
      'express',
      'mongoose',
      'dotenv',
      'cors',
      'helmet',
      'express-rate-limit',
      'compression',
      'express-mongo-sanitize'
    ];
    
    criticalDeps.forEach(dep => {
      const depPath = path.join(nodeModulesPath, dep);
      if (!fs.existsSync(depPath)) {
        error(`Critical dependency ${dep} not installed`);
      } else {
        success(`${dep} is installed`);
      }
    });
  }
}

// 3. Check required directories
console.log('\n📁 Checking directory structure...');
const requiredDirs = [
  'models',
  'routes',
  'middleware',
  'utils',
  'uploads'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    if (dir === 'uploads') {
      warning(`${dir} directory not found (will be created automatically)`);
    } else {
      error(`Required directory ${dir} not found`);
    }
  } else {
    success(`${dir} directory exists`);
  }
});

// 4. Check critical files
console.log('\n📄 Checking critical files...');
const criticalFiles = [
  'server.js',
  'models/User.js',
  'models/Problem.js',
  'routes/auth.js',
  'routes/problems.js',
  'middleware/auth.js',
  'utils/notifications.js'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    error(`Critical file ${file} not found`);
  } else {
    success(`${file} exists`);
  }
});

// 5. Validate MongoDB URI format
console.log('\n🗄️  Validating MongoDB configuration...');
if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_URI.startsWith('mongodb://') || 
      process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    success('MongoDB URI format is valid');
  } else {
    error('MongoDB URI format is invalid');
  }
} else {
  error('MongoDB URI not configured');
}

// 6. Check JWT Secret strength
console.log('\n🔐 Validating security configuration...');
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 32) {
    warning('JWT_SECRET should be at least 32 characters for production');
  } else {
    success('JWT_SECRET has adequate length');
  }
}

// 7. Check Node version
console.log('\n🔧 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
  error(`Node.js version ${nodeVersion} is too old. Requires v18+`);
} else {
  success(`Node.js version ${nodeVersion} is compatible`);
}

// 8. Test mongoose connection options (syntax check)
console.log('\n🔌 Validating Mongoose configuration...');
try {
  const mongoose = require('mongoose');
  const validOptions = ['maxPoolSize', 'serverSelectionTimeoutMS', 'socketTimeoutMS'];
  success('Mongoose module loaded successfully');
  info(`Using Mongoose version: ${mongoose.version}`);
} catch (err) {
  error(`Failed to load Mongoose: ${err.message}`);
}

// Final summary
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(50));

if (hasErrors) {
  console.log(`${colors.red}❌ VALIDATION FAILED${colors.reset}`);
  console.log('Please fix the errors above before starting the server.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log(`${colors.yellow}⚠️  VALIDATION PASSED WITH WARNINGS${colors.reset}`);
  console.log('Server can start, but some features may not work correctly.\n');
  process.exit(0);
} else {
  console.log(`${colors.green}✅ ALL CHECKS PASSED${colors.reset}`);
  console.log('Server is ready to start!\n');
  process.exit(0);
}
