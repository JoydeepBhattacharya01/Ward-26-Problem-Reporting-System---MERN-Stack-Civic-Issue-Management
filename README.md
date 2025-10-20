# ২৬ নম্বর ওয়ার্ড – আমাদের ওয়ার্ড

**"আমার এলাকা, আমার দায়িত্ব"**

A comprehensive MERN stack web application for Ward 26 citizens to report civic issues directly to the ward administration.

## 🌟 Features

### For Citizens
- **User Registration & Login** - Simple authentication system
- **Problem Categories**:
  - ⚡ বিদ্যুৎ সমস্যা (Electricity Problems)
  - 💧 নর্দমা সমস্যা (Drainage Problems)
  - 🛣️ রাস্তাঘাট সমস্যা (Road Problems)
  - 🎉 উৎসব (Festival)
  - 📝 অন্যান্য (Other)
- **Image Upload** - Attach up to 5 images per report
- **GPS Location** - Automatic location detection
- **Track Reports** - View status of submitted complaints

### For Admins
- **Secure Admin Dashboard** - Separate login for administrators
- **Complaint Management** - View, update, and resolve issues
- **Status Updates** - Mark problems as Pending, In Progress, or Resolved
- **Statistics** - Overview of all complaints
- **Email & SMS Notifications** - Automatic alerts for new complaints

## 💻 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (File Upload)
- Nodemailer (Email)
- Twilio (SMS)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd ward26-problem-reporting
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ward26db
JWT_SECRET=your_secret_key_here

# Admin Emails
ADMIN_EMAIL_1=admin1@ward26.gov.bd
ADMIN_EMAIL_2=admin2@ward26.gov.bd
ADMIN_EMAIL_3=admin3@ward26.gov.bd

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE_1=+8801XXXXXXXXX
ADMIN_PHONE_2=+8801XXXXXXXXX
ADMIN_PHONE_3=+8801XXXXXXXXX

FRONTEND_URL=http://localhost:3000
```

### 3. Seed Admin Users

```bash
cd backend
node scripts/seedAdmin.js
```

Default admin credentials:
- Email: `admin1@ward26.gov.bd` | Password: `admin123456`
- Email: `admin2@ward26.gov.bd` | Password: `admin123456`
- Email: `admin3@ward26.gov.bd` | Password: `admin123456`

⚠️ **Change these passwords in production!**

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 📱 Usage

### For Citizens

1. **Register** - Create an account with name, phone, and password
2. **Login** - Access your account
3. **Select Category** - Choose the type of problem
4. **Fill Details** - Provide description, location, and images
5. **Submit** - Your complaint is sent to admins
6. **Track** - View status updates in "My Reports"

### For Admins

1. **Admin Login** - Use admin credentials at `/admin/login`
2. **Dashboard** - View all complaints with statistics
3. **Filter** - Sort by status (Pending, In Progress, Resolved)
4. **Update** - Change status and add admin notes
5. **Notifications** - Receive email/SMS for new complaints

## 🎨 Design

- **Color Theme**: Blue and White (Government style)
- **Bengali-first Interface**: All labels in Bengali
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Clean UI**: Simple and user-friendly for citizens with limited digital literacy

## 📧 Email Configuration

For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `.env`

## 📱 SMS Configuration (Optional)

1. Sign up for Twilio account
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- Admin-only access control
- Input validation
- File upload restrictions

## 📂 Project Structure

```
ward26-problem-reporting/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities (notifications)
│   ├── scripts/         # Seed scripts
│   ├── uploads/         # Uploaded images
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       ├── App.js       # Main app
│       └── index.js     # Entry point
└── README.md
```

## 🌐 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy backend
3. Update FRONTEND_URL

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy build folder
3. Set API proxy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update MONGODB_URI

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`

**CORS Error:**
- Verify FRONTEND_URL in backend `.env`
- Check proxy in frontend `package.json`

**Image Upload Error:**
- Ensure `uploads/` directory exists
- Check file size limits (5MB)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Problems
- `POST /api/problems` - Create problem report
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get single problem
- `PUT /api/problems/:id/status` - Update status (Admin)
- `GET /api/problems/stats/summary` - Get statistics (Admin)

## 👥 Contributors

Built for Ward 26 community service

## 📄 License

MIT License

## 🙏 Acknowledgments

- Ward 26 Administration
- Citizens of Ward 26
- Open source community

---

**For support, contact Ward 26 Administration**

**সেবায় নিয়োজিত আছি আমরা**
