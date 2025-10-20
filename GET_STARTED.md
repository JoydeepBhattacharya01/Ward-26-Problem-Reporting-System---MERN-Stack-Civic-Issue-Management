# 🚀 GET STARTED - Ward 26 Problem Reporting System

## 📋 What You Have

A complete **MERN Stack** web application with:
- ✅ Backend API (Node.js + Express + MongoDB)
- ✅ Frontend UI (React + Tailwind CSS)
- ✅ Authentication (JWT)
- ✅ Admin Dashboard
- ✅ Email/SMS Notifications
- ✅ Image Upload
- ✅ Bengali Interface
- ✅ Complete Documentation

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Everything
```bash
cd /Users/joydeep/CascadeProjects/ward26-problem-reporting
./setup.sh
```

This will:
- Install backend dependencies
- Install frontend dependencies
- Create .env file
- Create uploads directory

### Step 2: Configure Database
```bash
# Option A: Use Local MongoDB
brew services start mongodb-community

# Option B: Use MongoDB Atlas (Cloud)
# Get connection string from https://cloud.mongodb.com
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ward26db
# OR
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ward26db
```

### Step 3: Run the App
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**Done!** 🎉 Open http://localhost:3000

---

## 🎯 First Time Setup Checklist

### 1️⃣ Install Dependencies
```bash
./setup.sh
```
✅ Installs all npm packages

### 2️⃣ Configure Environment
```bash
cd backend
nano .env  # or use any text editor
```

**Minimum Required:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ward26db
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

**Optional (for notifications):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3️⃣ Seed Admin Users
```bash
cd backend
node scripts/seedAdmin.js
```

You'll get:
```
✅ Admin users seeded successfully!

Default admin credentials:
Email: admin1@ward26.gov.bd, Password: admin123456
Email: admin2@ward26.gov.bd, Password: admin123456
Email: admin3@ward26.gov.bd, Password: admin123456
```

### 4️⃣ Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```
✅ Server runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm start
```
✅ App opens on http://localhost:3000

---

## 🎮 Test the Application

### As a User:

1. **Register**
   - Go to http://localhost:3000
   - Click "সমস্যা রিপোর্ট করুন"
   - Fill: Name, Phone (01712345678), Password
   - Click "রেজিস্টার করুন"

2. **Report a Problem**
   - Select category (e.g., "বিদ্যুৎ সমস্যা")
   - Fill details
   - Upload images (optional)
   - Add location
   - Submit

3. **View Reports**
   - Click "আমার রিপোর্টসমূহ দেখুন"
   - See all your submissions
   - Check status

### As an Admin:

1. **Login**
   - Go to http://localhost:3000/admin/login
   - Email: admin1@ward26.gov.bd
   - Password: admin123456

2. **Manage Problems**
   - View dashboard statistics
   - See all complaints
   - Filter by status
   - Update status
   - Add notes

---

## 📁 Project Structure

```
ward26-problem-reporting/
│
├── 📄 Documentation
│   ├── README.md           ← Full documentation
│   ├── QUICKSTART.md       ← 5-min setup
│   ├── DEPLOYMENT.md       ← Deploy to production
│   ├── TESTING.md          ← Test checklist
│   └── GET_STARTED.md      ← This file
│
├── 🔧 Backend (Port 5000)
│   ├── models/             ← Database schemas
│   ├── routes/             ← API endpoints
│   ├── middleware/         ← Auth protection
│   ├── utils/              ← Notifications
│   ├── scripts/            ← Admin seeding
│   └── server.js           ← Main server
│
├── 🎨 Frontend (Port 3000)
│   ├── src/
│   │   ├── pages/          ← All pages
│   │   ├── components/     ← Reusable parts
│   │   ├── context/        ← Auth state
│   │   └── App.js          ← Main app
│   └── public/             ← Static files
│
└── 🛠️ Config
    ├── package.json        ← Scripts
    ├── setup.sh            ← Auto setup
    └── .env.example        ← Config template
```

---

## 🔑 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main app |
| **Backend API** | http://localhost:5000 | API server |
| **User Login** | http://localhost:3000/login | User access |
| **Admin Login** | http://localhost:3000/admin/login | Admin panel |
| **API Health** | http://localhost:5000/api/health | Check API |

---

## 🎨 Features Overview

### 🏠 Landing Page
- Beautiful blue & white design
- Bengali text
- 3 main buttons:
  - Admin Login
  - User Login
  - Report Problem

### 👤 User Features
- Register with phone number
- Login with credentials
- Select problem category:
  - ⚡ Electricity
  - 💧 Drainage
  - 🛣️ Road
  - 🎉 Festival
  - 📝 Other
- Upload up to 5 images
- Add GPS location
- Track report status

### 👨‍💼 Admin Features
- Secure admin login
- Dashboard with stats
- View all complaints
- Filter by status
- Update problem status
- Add admin notes
- Real-time notifications

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Running
```bash
# Start MongoDB
brew services start mongodb-community

# Check status
brew services list
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### CORS Error
- Check `FRONTEND_URL` in backend/.env
- Should be: `http://localhost:3000`
- Restart backend server

### Can't Login
- Check if MongoDB is running
- Check if admin users are seeded
- Check browser console for errors

---

## 📚 Learn More

| Document | What You'll Learn |
|----------|-------------------|
| **README.md** | Complete documentation, all features |
| **QUICKSTART.md** | Fast 5-minute setup |
| **DEPLOYMENT.md** | Deploy to production (Railway, Vercel) |
| **TESTING.md** | Complete testing checklist |
| **PROJECT_SUMMARY.md** | Project overview and statistics |
| **CHANGELOG.md** | Version history |

---

## 🎯 Common Tasks

### Add a New Admin
```bash
cd backend
node scripts/seedAdmin.js
```

### View Backend Logs
```bash
cd backend
npm run dev
# Watch the console
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Reset Database
```bash
# Drop database
mongosh
> use ward26db
> db.dropDatabase()

# Reseed admins
node backend/scripts/seedAdmin.js
```

---

## 🚀 Next Steps

### For Development:
1. ✅ Run the app locally
2. ✅ Test all features
3. ✅ Customize text/colors
4. ✅ Add your branding

### For Production:
1. 📖 Read DEPLOYMENT.md
2. 🗄️ Setup MongoDB Atlas
3. 📧 Configure email/SMS
4. 🚀 Deploy to Railway/Vercel
5. 🔒 Change admin passwords
6. 🎉 Launch!

---

## 💡 Pro Tips

1. **Use MongoDB Atlas** for easy cloud database
2. **Setup Gmail App Password** for email notifications
3. **Test thoroughly** before going live
4. **Change default passwords** immediately
5. **Monitor logs** for errors
6. **Backup database** regularly
7. **Use environment variables** for all secrets

---

## 📞 Need Help?

### Check These First:
1. Console errors (F12 in browser)
2. Backend terminal logs
3. MongoDB connection
4. .env configuration

### Documentation:
- README.md - Full docs
- TESTING.md - Test guide
- DEPLOYMENT.md - Deploy guide

### Common Issues:
- Port conflicts → Kill processes
- MongoDB errors → Check connection
- CORS errors → Check FRONTEND_URL
- Auth errors → Check JWT_SECRET

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Admin users seeded
- [ ] Can register new user
- [ ] Can login as user
- [ ] Can submit problem report
- [ ] Can view reports
- [ ] Can login as admin
- [ ] Can see admin dashboard
- [ ] Can update problem status
- [ ] No console errors

---

## 🎉 You're Ready!

Once all checks pass, you have a fully functional civic problem reporting system!

### What You Can Do Now:
- ✅ Accept citizen complaints
- ✅ Manage problems efficiently
- ✅ Track resolution status
- ✅ Notify administrators
- ✅ Serve your community

---

## "আমার এলাকা, আমার দায়িত্ব"

**Ward 26 - Serving the Community**

---

**Need more help?** Check the other documentation files or review the code comments.

**Ready to deploy?** See DEPLOYMENT.md for production setup.

**Happy Coding! 🚀**
