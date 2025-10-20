# 🚀 Deployment Guide - Ward 26 Problem Reporting System

This guide will help you deploy the application to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Email service configured (Gmail/SendGrid)
- [ ] Twilio account setup (optional, for SMS)
- [ ] Domain name (optional)
- [ ] SSL certificate (automatic with most platforms)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for testing)

### 2. Configure Database
1. Click "Connect" on your cluster
2. Add your IP address or allow access from anywhere (0.0.0.0/0)
3. Create a database user with username and password
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ward26db?retryWrites=true&w=majority
   ```

### 3. Seed Admin Users
```bash
# Update .env with Atlas connection string
MONGODB_URI=mongodb+srv://...

# Run seed script
node scripts/seedAdmin.js
```

## 🔧 Backend Deployment

### Option 1: Railway.app (Recommended)

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set PORT=5000
   railway variables set MONGODB_URI="your_mongodb_uri"
   railway variables set JWT_SECRET="your_secret"
   railway variables set EMAIL_HOST="smtp.gmail.com"
   railway variables set EMAIL_PORT=587
   railway variables set EMAIL_USER="your_email"
   railway variables set EMAIL_PASSWORD="your_password"
   railway variables set FRONTEND_URL="https://your-frontend-url.vercel.app"
   # Add other variables...
   ```

5. **Get Backend URL**
   ```bash
   railway domain
   ```
   Note this URL for frontend configuration.

### Option 2: Render.com

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: ward26-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Add environment variables in the dashboard
6. Click "Create Web Service"

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   brew tap heroku/brew && brew install heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create ward26-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_secret"
   # ... set all other variables
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**
   - Follow the prompts
   - Set build command: `npm run build`
   - Set output directory: `build`

4. **Set Environment Variable**
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

5. **Update API Calls**
   In `frontend/src/context/AuthContext.js` and other files, update axios base URL:
   ```javascript
   axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Configure Redirects**
   Create `frontend/public/_redirects`:
   ```
   /api/* https://your-backend-url.railway.app/api/:splat 200
   /* /index.html 200
   ```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD` environment variable

### SendGrid (Alternative)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Update email configuration:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   ```

## 📱 SMS Configuration (Twilio)

1. Sign up at [Twilio](https://www.twilio.com)
2. Get a phone number
3. Find your Account SID and Auth Token in the dashboard
4. Set environment variables:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## 🔒 Security Checklist

- [ ] Change default admin passwords
- [ ] Use strong JWT_SECRET (generate with: `openssl rand -base64 32`)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB IP whitelist
- [ ] Set up database backups
- [ ] Implement rate limiting (optional)
- [ ] Add monitoring (optional)

## 🌐 Custom Domain Setup

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway
1. Go to your service settings
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update DNS with CNAME record

## 📊 Monitoring & Logs

### View Logs

**Railway:**
```bash
railway logs
```

**Heroku:**
```bash
heroku logs --tail
```

**Render:**
- View logs in the dashboard

## 🔄 Updates & Maintenance

### Update Backend
```bash
cd backend
git pull
railway up  # or your deployment command
```

### Update Frontend
```bash
cd frontend
git pull
npm run build
vercel --prod  # or your deployment command
```

## 🐛 Common Issues

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check CORS configuration in `server.js`

### Database Connection Failed
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Images Not Loading
- Check if uploads directory exists
- Verify file upload limits
- Ensure proper file permissions

### Email Not Sending
- Verify email credentials
- Check spam folder
- Enable "Less secure app access" (Gmail) or use App Password

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check database connection

## 🎉 Post-Deployment

After successful deployment:
1. Test all features thoroughly
2. Create test user accounts
3. Submit test complaints
4. Verify email/SMS notifications
5. Test admin dashboard
6. Monitor for errors

---

**Congratulations! Your Ward 26 Problem Reporting System is now live! 🚀**

**সেবায় নিয়োজিত আছি আমরা**
