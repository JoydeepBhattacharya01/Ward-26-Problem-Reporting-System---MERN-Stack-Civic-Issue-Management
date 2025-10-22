# Port Management Guide

## 🚨 Problem Solved!

The port 3000 conflict issue has been resolved. Here are all the solutions available:

## ✅ **Quick Fix (Recommended)**

**Just run this command:**
```bash
node fix-port-conflict.js
```

This will:
- ✅ Kill any processes using ports 3000 and 8000
- ✅ Configure your app to use the correct ports
- ✅ Update all configuration files

## 🚀 **Starting Your Application**

### Option 1: Automatic Startup (Easiest)
```bash
./start-app.sh
```
This script will:
- Check for port conflicts
- Ask what to do if ports are busy
- Automatically find alternative ports if needed
- Start both frontend and backend

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Option 3: Alternative Ports
If port 3000 is still busy, use alternative ports:
```bash
# Frontend on port 3001
cd frontend
npm run start:3001

# Frontend on port 3002
cd frontend  
npm run start:3002
```

## 🔧 **Available Commands**

| Command | Description |
|---------|-------------|
| `node fix-port-conflict.js` | Kill processes and fix port conflicts |
| `./start-app.sh` | Smart startup with conflict resolution |
| `node port-manager.js` | Advanced port management |
| `node port-manager.js cleanup` | Clean up all ports |
| `node port-manager.js kill 3000` | Kill specific port |

## 📋 **Port Configuration**

**Default Ports:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

**Alternative Ports (if conflicts occur):**
- Frontend: `http://localhost:3001`, `http://localhost:3002`, etc.
- Backend: `http://localhost:8001`, `http://localhost:8002`, etc.

## 🔍 **Troubleshooting**

### If you still get "port in use" errors:

1. **Check what's using the port:**
   ```bash
   lsof -i:3000
   ```

2. **Kill the process manually:**
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

3. **Use the fix script:**
   ```bash
   node fix-port-conflict.js
   ```

### If ports keep getting occupied:

1. **Use alternative ports permanently:**
   ```bash
   # Set environment variable
   export PORT=3001
   cd frontend && npm start
   ```

2. **Or modify package.json:**
   ```json
   {
     "scripts": {
       "start": "PORT=3001 react-scripts start"
     }
   }
   ```

## 🛠️ **What Was Fixed**

1. **✅ Automatic Port Detection**: Scripts now detect and handle port conflicts
2. **✅ Process Management**: Automatic killing of conflicting processes
3. **✅ Configuration Updates**: Automatic proxy and environment updates
4. **✅ Alternative Ports**: Multiple port options available
5. **✅ Smart Startup**: Intelligent startup script with user choices

## 🚀 **Quick Start After Fix**

```bash
# 1. Fix any port conflicts
node fix-port-conflict.js

# 2. Start the application
./start-app.sh

# 3. Open browser to http://localhost:3000
```

## 📝 **Files Created**

- `fix-port-conflict.js` - Quick port conflict resolution
- `start-app.sh` - Smart application startup
- `port-manager.js` - Advanced port management
- `PORT_MANAGEMENT.md` - This guide

## 🎯 **No More Port Conflicts!**

You'll never have to worry about port 3000 conflicts again. The system will:
- Automatically detect conflicts
- Offer solutions (kill process or use different port)
- Update configurations automatically
- Start your app on available ports

**Just run `./start-app.sh` and you're good to go!** 🚀
