# 🎮 Command Reference - Ward 26 Problem Reporting System

Quick reference for all commands you'll need.

---

## 🚀 Initial Setup

```bash
# Navigate to project
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting

# Run automated setup
./setup.sh

# Or manual setup
cd backend && npm install
cd ../frontend && npm install
```

---

## 🗄️ Database Commands

### MongoDB Local

```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Check status
brew services list

# Access MongoDB shell
mongosh

# In mongosh:
use ward26db              # Switch to database
show collections          # Show tables
db.users.find()          # View users
db.problems.find()       # View problems
db.dropDatabase()        # Delete database (careful!)
```

### Seed Admin Users

```bash
cd backend
node scripts/seedAdmin.js
```

---

## 🔧 Development Commands

### Backend

```bash
cd backend

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Install specific package
npm install package-name
```

### Frontend

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Install dependencies
npm install

# Install specific package
npm install package-name
```

### Both (from root)

```bash
# Install all dependencies
npm run install-all

# Start both servers (requires concurrently)
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client
```

---

## 📦 Package Management

### Backend Dependencies

```bash
cd backend

# View installed packages
npm list --depth=0

# Update packages
npm update

# Check for outdated packages
npm outdated

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Dependencies

```bash
cd frontend

# View installed packages
npm list --depth=0

# Update packages
npm update

# Check for outdated packages
npm outdated

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Debugging Commands

### Check Ports

```bash
# Check what's running on port 5000
lsof -i :5000

# Check what's running on port 3000
lsof -i :3000

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### View Logs

```bash
# Backend logs (while running npm run dev)
# Just watch the terminal

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Check system logs
tail -f /var/log/system.log
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Test with pretty print
curl http://localhost:5000/api/health | json_pp

# Using httpie (if installed)
http http://localhost:5000/api/health
```

---

## 🧪 Testing Commands

### Manual Testing

```bash
# Test backend API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"01712345678","password":"test123"}'

# Test with authentication
curl -X GET http://localhost:5000/api/problems \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Browser Testing

```bash
# Open in default browser
open http://localhost:3000

# Open in specific browser
open -a "Google Chrome" http://localhost:3000
open -a "Firefox" http://localhost:3000
open -a "Safari" http://localhost:3000
```

---

## 🗂️ File Operations

### View Files

```bash
# List all files
ls -la

# View file content
cat backend/server.js

# View with line numbers
cat -n backend/server.js

# View large files
less backend/server.js

# Search in files
grep -r "search term" .
```

### Edit Files

```bash
# Using nano
nano backend/.env

# Using vim
vim backend/.env

# Using VS Code
code backend/.env

# Open entire project in VS Code
code .
```

---

## 🔄 Git Commands (Optional)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
uploads/*
!uploads/.gitkeep
.DS_Store
EOF

# View status
git status

# View changes
git diff

# Create branch
git checkout -b feature-name

# Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

---

## 🧹 Cleanup Commands

### Remove Dependencies

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json

# Frontend
cd frontend
rm -rf node_modules package-lock.json

# Both
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
```

### Clear Uploads

```bash
# Remove all uploaded images
rm -rf backend/uploads/*
touch backend/uploads/.gitkeep
```

### Clear Build Files

```bash
# Remove frontend build
rm -rf frontend/build

# Clear cache
npm cache clean --force
```

---

## 📊 Monitoring Commands

### Check System Resources

```bash
# Check disk space
df -h

# Check memory usage
top

# Check Node processes
ps aux | grep node

# Monitor file changes
watch -n 1 'ls -lh backend/uploads'
```

### Database Stats

```bash
# In mongosh
use ward26db
db.stats()
db.users.count()
db.problems.count()
```

---

## 🚀 Deployment Commands

### Build for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend (no build needed)
cd backend
npm start
```

### Environment Setup

```bash
# Copy env file
cp backend/.env.example backend/.env

# Edit env file
nano backend/.env

# Verify env variables
cat backend/.env
```

---

## 🔐 Security Commands

### Generate Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate random password
openssl rand -base64 16

# Generate UUID
uuidgen
```

### Check Permissions

```bash
# View file permissions
ls -la backend/.env

# Make script executable
chmod +x setup.sh

# Secure .env file
chmod 600 backend/.env
```

---

## 📱 Network Commands

### Check Connectivity

```bash
# Ping localhost
ping localhost

# Check if port is open
nc -zv localhost 5000
nc -zv localhost 3000

# View network connections
netstat -an | grep LISTEN
```

### DNS/Hosts

```bash
# View hosts file
cat /etc/hosts

# Flush DNS cache
sudo dscacheutil -flushcache
```

---

## 🛠️ Utility Commands

### Process Management

```bash
# List all node processes
ps aux | grep node

# Kill all node processes
pkill -f node

# Run in background
npm run dev &

# View background jobs
jobs

# Bring to foreground
fg %1
```

### File Search

```bash
# Find files by name
find . -name "*.js"

# Find files by content
grep -r "search term" backend/

# Find large files
find . -type f -size +1M
```

---

## 📋 Quick Reference Card

```bash
# ═══════════════════════════════════════════════════
# MOST USED COMMANDS
# ═══════════════════════════════════════════════════

# Setup
./setup.sh                           # Initial setup
node backend/scripts/seedAdmin.js    # Seed admins

# Development
cd backend && npm run dev            # Start backend
cd frontend && npm start             # Start frontend

# Database
brew services start mongodb-community  # Start MongoDB
mongosh                                # MongoDB shell

# Debugging
lsof -ti:5000 | xargs kill -9       # Kill port 5000
lsof -ti:3000 | xargs kill -9       # Kill port 3000

# Testing
curl http://localhost:5000/api/health  # Test API
open http://localhost:3000             # Open app

# Cleanup
rm -rf node_modules && npm install   # Reinstall deps
```

---

## 🎯 Command Aliases (Optional)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Ward 26 Project Aliases
alias w26="cd /Users/joydeep/CascadeProjects/ward26-problem-reporting"
alias w26-backend="cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/backend && npm run dev"
alias w26-frontend="cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/frontend && npm start"
alias w26-seed="cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/backend && node scripts/seedAdmin.js"
alias w26-mongo="brew services start mongodb-community"
alias w26-kill="lsof -ti:5000 | xargs kill -9; lsof -ti:3000 | xargs kill -9"
```

Then reload:
```bash
source ~/.zshrc
```

Now you can use:
```bash
w26              # Go to project
w26-backend      # Start backend
w26-frontend     # Start frontend
w26-seed         # Seed admins
w26-mongo        # Start MongoDB
w26-kill         # Kill all ports
```

---

## 📞 Help Commands

```bash
# Node.js help
node --help

# npm help
npm help

# MongoDB help
mongosh --help

# Git help
git --help

# View package.json scripts
cat package.json | grep scripts -A 10
```

---

## 🎉 That's It!

Save this file for quick reference while developing.

**Pro Tip:** Keep this file open in a separate tab for easy access to commands.

---

**"আমার এলাকা, আমার দায়িত্ব"**
