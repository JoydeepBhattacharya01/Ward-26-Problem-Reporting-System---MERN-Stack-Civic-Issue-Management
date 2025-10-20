# 🚀 How to Open and Run - Ward 26 Problem Reporting System

## Step-by-Step Guide for First Time

---

## 📂 Step 1: Open the Project in Your Editor

### Option A: Using VS Code (Recommended)

```bash
# Open the entire project folder
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting
code .
```

This will open VS Code with the entire project.

### Option B: Using Terminal + Any Editor

```bash
# Navigate to project
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting

# Open in your preferred editor
# For VS Code:
code .

# For Sublime Text:
subl .

# For Atom:
atom .

# Or just use Finder:
open .
```

---

## 🔧 Step 2: Install Dependencies

### Open Terminal in VS Code
- Press `` Ctrl + ` `` (backtick) or
- Menu: Terminal → New Terminal

### Run the Setup Script

```bash
# Make sure you're in the project root
pwd
# Should show: /Users/joydeep/CascadeProjects/ward26-problem-reporting

# Run automated setup
./setup.sh
```

**What this does:**
- ✅ Installs backend dependencies
- ✅ Installs frontend dependencies
- ✅ Creates .env file
- ✅ Creates uploads directory

**Alternative (Manual Installation):**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

---

## ⚙️ Step 3: Configure Environment Variables

### Edit the .env file

```bash
# Open .env file in VS Code
code backend/.env

# Or use nano
nano backend/.env

# Or use vim
vim backend/.env
```

### Minimum Configuration Needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ward26db
JWT_SECRET=your_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000

# Optional (for email/SMS notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

ADMIN_EMAIL_1=admin1@ward26.gov.bd
ADMIN_EMAIL_2=admin2@ward26.gov.bd
ADMIN_EMAIL_3=admin3@ward26.gov.bd
```

**Save the file:**
- VS Code: `Cmd + S`
- Nano: `Ctrl + X`, then `Y`, then `Enter`
- Vim: Press `Esc`, type `:wq`, press `Enter`

---

## 🗄️ Step 4: Start MongoDB

### Check if MongoDB is installed:

```bash
mongod --version
```

### If MongoDB is installed:

```bash
# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list
```

### If MongoDB is NOT installed:

**Option A: Install MongoDB locally**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option B: Use MongoDB Atlas (Cloud - Easier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (M0 Free tier)
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

---

## 👥 Step 5: Seed Admin Users

```bash
# Make sure you're in the project root
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting

# Run seed script
cd backend
node scripts/seedAdmin.js
```

**You should see:**
```
MongoDB Connected: localhost
✓ Admin created: Admin 1 (admin1@ward26.gov.bd)
✓ Admin created: Admin 2 (admin2@ward26.gov.bd)
✓ Admin created: Admin 3 (admin3@ward26.gov.bd)

✅ Admin users seeded successfully!

Default admin credentials:
Email: admin1@ward26.gov.bd, Password: admin123456
Email: admin2@ward26.gov.bd, Password: admin123456
Email: admin3@ward26.gov.bd, Password: admin123456
```

---

## 🚀 Step 6: Run the Application

### You need TWO terminal windows/tabs

### Terminal 1 - Backend Server

```bash
# Navigate to backend folder
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/backend

# Start backend server
npm run dev
```

**You should see:**
```
╔════════════════════════════════════════════╗
║  ২৬ নম্বর ওয়ার্ড - সার্ভার চালু আছে      ║
║  Port: 5000                                ║
║  Environment: development                  ║
╚════════════════════════════════════════════╝

MongoDB Connected: localhost
```

**✅ Backend is running on http://localhost:5000**

---

### Terminal 2 - Frontend Server

**Open a NEW terminal tab/window:**
- VS Code: Click the `+` icon in terminal panel
- Or press `` Cmd + Shift + ` ``

```bash
# Navigate to frontend folder
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/frontend

# Start frontend server
npm start
```

**You should see:**
```
Compiled successfully!

You can now view ward26-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**✅ Frontend will automatically open in your browser at http://localhost:3000**

---

## 🎉 Step 7: Test the Application

### Your browser should now show the landing page!

### Test as a User:

1. **Register a new account:**
   - Click "সমস্যা রিপোর্ট করুন" (Report Problem)
   - Fill in:
     - নাম: Your Name
     - মোবাইল নাম্বার: 01712345678
     - পাসওয়ার্ড: test123456
   - Click "রেজিস্টার করুন"

2. **Report a problem:**
   - Select a category (e.g., "বিদ্যুৎ সমস্যা")
   - Fill in the details
   - Upload images (optional)
   - Add location
   - Submit

3. **View your reports:**
   - Click "আমার রিপোর্টসমূহ দেখুন"

### Test as an Admin:

1. **Login as admin:**
   - Go to http://localhost:3000/admin/login
   - Email: admin1@ward26.gov.bd
   - Password: admin123456

2. **Manage problems:**
   - View dashboard
   - See all complaints
   - Update status
   - Add notes

---

## 📊 Visual Guide - Terminal Setup

```
┌─────────────────────────────────────────────────────────┐
│  VS Code Window                                         │
├─────────────────────────────────────────────────────────┤
│  File Explorer (Left)    │  Editor (Right)              │
│  ├── backend/            │  backend/.env                │
│  │   ├── models/         │  (Edit configuration)        │
│  │   ├── routes/         │                              │
│  │   └── server.js       │                              │
│  └── frontend/           │                              │
│      └── src/            │                              │
├─────────────────────────────────────────────────────────┤
│  Terminal Panel (Bottom)                                │
│  ┌─────────────────────┬─────────────────────────────┐ │
│  │ Terminal 1: BACKEND │ Terminal 2: FRONTEND        │ │
│  │ cd backend          │ cd frontend                 │ │
│  │ npm run dev         │ npm start                   │ │
│  │ [Running on :5000]  │ [Running on :3000]          │ │
│  └─────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Verification Checklist

After running, verify these:

- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Backend terminal shows "Port: 5000"
- [ ] Frontend terminal shows "Compiled successfully"
- [ ] Browser opens automatically to http://localhost:3000
- [ ] Landing page shows "২৬ নম্বর ওয়ার্ড – আমাদের ওয়ার্ড"
- [ ] Page has blue and white colors
- [ ] Three buttons visible (Admin Login, User Login, Report Problem)
- [ ] No errors in browser console (Press F12 to check)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"

```bash
# Kill the process on port 5000
lsof -ti:5000 | xargs kill -9

# Then restart backend
cd backend
npm run dev
```

### Issue 2: "Port 3000 already in use"

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart frontend
cd frontend
npm start
```

### Issue 3: "MongoDB connection error"

```bash
# Check if MongoDB is running
brew services list

# If not running, start it
brew services start mongodb-community

# Verify connection
mongosh
```

### Issue 4: "Module not found"

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Cannot find .env file"

```bash
# Copy example file
cd backend
cp .env.example .env

# Then edit it
code .env
```

### Issue 6: Browser doesn't open automatically

```bash
# Manually open browser and go to:
http://localhost:3000
```

---

## 🎯 Quick Commands Reference

### Start Everything (After First Setup)

```bash
# Terminal 1 - Backend
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting/frontend
npm start
```

### Stop Everything

```bash
# In each terminal, press:
Ctrl + C

# Or kill all processes:
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Restart

```bash
# Stop (Ctrl + C in both terminals)
# Then start again with npm run dev and npm start
```

---

## 📱 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:5000 | API server |
| **API Health** | http://localhost:5000/api/health | Check if API is running |
| **User Login** | http://localhost:3000/login | User access |
| **Admin Login** | http://localhost:3000/admin/login | Admin panel |

---

## 🎓 What Each Terminal Does

### Terminal 1 (Backend - Port 5000)
- Runs Node.js/Express server
- Connects to MongoDB
- Handles API requests
- Processes authentication
- Manages file uploads
- Sends notifications

### Terminal 2 (Frontend - Port 3000)
- Runs React development server
- Serves the web interface
- Hot reloads on code changes
- Compiles Tailwind CSS
- Proxies API requests to backend

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Watch for errors** in both terminal windows
3. **Check browser console** (F12) for frontend errors
4. **Use Ctrl + C** to stop servers (not close terminal)
5. **Save files** before testing changes
6. **Clear browser cache** if changes don't appear

---

## 🎉 Success!

If you see:
- ✅ Backend running without errors
- ✅ Frontend compiled successfully
- ✅ Browser shows the landing page
- ✅ No console errors

**You're all set! The application is running! 🚀**

---

## 📚 Next Steps

1. **Test the application** - Register, login, submit problems
2. **Read documentation** - Check INDEX.md for guides
3. **Customize** - Modify colors, text, features
4. **Deploy** - Follow DEPLOYMENT.md when ready

---

## 🆘 Still Having Issues?

1. Check [GET_STARTED.md](GET_STARTED.md) - Troubleshooting section
2. Check [COMMANDS.md](COMMANDS.md) - All commands
3. Review terminal output for error messages
4. Check MongoDB is running: `brew services list`
5. Verify .env file is configured correctly

---

**"আমার এলাকা, আমার দায়িত্ব"**

**Happy Coding! 🚀**
