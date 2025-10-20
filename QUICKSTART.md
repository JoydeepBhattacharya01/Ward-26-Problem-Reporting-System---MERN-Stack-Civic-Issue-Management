# ⚡ Quick Start Guide

Get the Ward 26 Problem Reporting System running in 5 minutes!

## 🎯 Prerequisites

Make sure you have installed:
- **Node.js** (v14+): Download from [nodejs.org](https://nodejs.org)
- **MongoDB**: 
  - Local: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation Steps

### Step 1: Install Dependencies

Open two terminal windows.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with minimum required settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ward26db
JWT_SECRET=my_super_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000

# For testing without email/SMS, you can skip these
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

### Step 3: Start MongoDB

**If using local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**If using MongoDB Atlas:**
- Just update the `MONGODB_URI` in `.env` with your Atlas connection string

### Step 4: Seed Admin Users

```bash
cd backend
node scripts/seedAdmin.js
```

You'll see:
```
✅ Admin users seeded successfully!

Default admin credentials:
Email: admin1@ward26.gov.bd, Password: admin123456
Email: admin2@ward26.gov.bd, Password: admin123456
Email: admin3@ward26.gov.bd, Password: admin123456
```

### Step 5: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║  ২৬ নম্বর ওয়ার্ড - সার্ভার চালু আছে      ║
║  Port: 5000                                ║
║  Environment: development                  ║
╚════════════════════════════════════════════╝
MongoDB Connected: localhost
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

## 🎉 You're Ready!

### Test the Application

1. **Landing Page** - You should see the beautiful blue and white homepage
2. **Register** - Click "সমস্যা রিপোর্ট করুন" to create an account
3. **Login** - Use your credentials to login
4. **Report Problem** - Select a category and submit a test complaint
5. **Admin Dashboard** - Login at `/admin/login` with admin credentials

## 🧪 Test Accounts

### Admin Login
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin1@ward26.gov.bd`
- **Password**: `admin123456`

### User Account
Create your own by registering at the homepage!

## 📱 Features to Test

### As a User:
- ✅ Register and login
- ✅ Select problem category (Electricity, Drainage, Road, Festival, Other)
- ✅ Fill subcategory details
- ✅ Add location (manual or GPS)
- ✅ Upload images (up to 5)
- ✅ View your submitted reports
- ✅ Track status updates

### As an Admin:
- ✅ Login to admin dashboard
- ✅ View all complaints
- ✅ Filter by status
- ✅ Update complaint status
- ✅ Add admin notes
- ✅ View statistics

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# macOS/Linux
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

### Cannot Find Module Error
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### CORS Error
- Make sure `FRONTEND_URL=http://localhost:3000` in backend `.env`
- Restart the backend server

## 📚 Next Steps

1. **Customize**: Update colors, text, and branding
2. **Email Setup**: Configure Gmail or SendGrid for notifications
3. **SMS Setup**: Add Twilio credentials for SMS alerts
4. **Deploy**: Follow `DEPLOYMENT.md` to deploy to production
5. **Security**: Change default admin passwords

## 🎨 Customization Tips

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',  // Main blue
    700: '#your-color',  // Darker blue
  }
}
```

### Change Text
All Bengali text is in the component files. Search and replace as needed.

### Add Categories
1. Update `categoryNames` in components
2. Add subcategories in `ReportProblemPage.js`
3. Update backend enum in `models/Problem.js`

## 📞 Need Help?

Check the full documentation:
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Deployment guide
- Backend API docs - Check route files in `backend/routes/`

## 🎊 Success!

You now have a fully functional civic problem reporting system!

**Test it thoroughly and customize it for your ward's needs.**

**"আমার এলাকা, আমার দায়িত্ব"**

---

**Happy Coding! 🚀**
