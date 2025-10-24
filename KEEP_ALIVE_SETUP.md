# Keep-Alive Setup Guide for Ward 26 Problem Reporting System

## Problem
Render's free tier puts services to sleep after 15 minutes of inactivity, causing:
- "Report cannot be accessed" errors
- Slow initial load times (cold starts)
- Database connection timeouts

## Solution
Use a free cron service to ping your backend every 5-10 minutes to keep it awake.

---

## Option 1: cron-job.org (Recommended - Free & Reliable)

### Setup Steps:

1. **Visit [cron-job.org](https://cron-job.org)**
   - Create a free account (no credit card required)

2. **Create New Cron Job**
   - Click "Create Cronjob"
   - **Title**: `Ward 26 Keep-Alive`
   - **URL**: `https://ward-26-problem-reporting-system-mern.onrender.com/api/health`
   - **Schedule**: Every 5 minutes
     - Pattern: `*/5 * * * *`
   - **Request Method**: GET
   - **Timeout**: 30 seconds
   - **Enable**: ✅ Active

3. **Configure Notifications (Optional)**
   - Email alerts if endpoint fails
   - Set failure threshold: 3 consecutive failures

4. **Save and Activate**

### Expected Results:
- ✅ Backend stays awake 24/7
- ✅ No more "report cannot be accessed" errors
- ✅ Instant response times
- ✅ Database stays connected

---

## Option 2: UptimeRobot (Free Tier)

### Setup Steps:

1. **Visit [UptimeRobot](https://uptimerobot.com)**
   - Create free account

2. **Add New Monitor**
   - Monitor Type: HTTP(s)
   - Friendly Name: `Ward 26 Backend`
   - URL: `https://ward-26-problem-reporting-system-mern.onrender.com/api/health`
   - Monitoring Interval: 5 minutes (free tier)

3. **Configure Alert Contacts**
   - Add email for downtime alerts

4. **Save Monitor**

---

## Option 3: Better Uptime (Free Tier)

### Setup Steps:

1. **Visit [Better Uptime](https://betteruptime.com)**
   - Sign up for free account

2. **Create Monitor**
   - URL: `https://ward-26-problem-reporting-system-mern.onrender.com/api/health`
   - Check frequency: 3 minutes (free tier)
   - Expected status code: 200

3. **Set Up Alerts**
   - Configure email/SMS notifications

---

## Option 4: Self-Hosted Keep-Alive Script

If you have a server or local machine that runs 24/7:

### Installation:

```bash
cd backend
npm install axios  # If not already installed
```

### Run the Script:

```bash
# Set your backend URL
export BACKEND_URL=https://ward-26-problem-reporting-system-mern.onrender.com

# Run the keep-alive script
node keep-alive.js
```

### Run as Background Service (Linux/Mac):

```bash
# Using PM2
npm install -g pm2
pm2 start keep-alive.js --name ward26-keepalive
pm2 save
pm2 startup
```

---

## Verification

### Check if Keep-Alive is Working:

1. **Monitor Render Dashboard**
   - Go to your Render dashboard
   - Check "Events" tab
   - Should see no "Service sleeping" events

2. **Test Health Endpoint**
   ```bash
   curl https://ward-26-problem-reporting-system-mern.onrender.com/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "OK",
     "message": "২৬ নম্বর ওয়ার্ড API চালু আছে",
     "timestamp": "2025-01-24T05:45:00.000Z",
     "uptime": 3600,
     "database": {
       "status": "connected",
       "readyState": 1
     }
   }
   ```

3. **Check Uptime**
   - The `uptime` field shows seconds since last restart
   - Should increase continuously if keep-alive is working

---

## Troubleshooting

### Issue: Backend Still Sleeping

**Possible Causes:**
- Cron job not running (check cron service logs)
- Wrong URL in cron job
- Cron interval too long (should be < 15 minutes)

**Solution:**
- Verify cron job is active
- Check execution history in cron service
- Reduce interval to 5 minutes

### Issue: Health Check Fails

**Possible Causes:**
- Database connection lost
- Render service crashed
- Environment variables missing

**Solution:**
1. Check Render logs for errors
2. Verify MongoDB connection string
3. Restart Render service manually
4. Check environment variables

### Issue: Cron Service Blocked

**Possible Causes:**
- Rate limiting (too many requests)
- IP blocked by Render

**Solution:**
- Increase cron interval to 10 minutes
- Use different cron service
- Check Render firewall settings

---

## Best Practices

### ✅ DO:
- Use 5-10 minute intervals (optimal for Render free tier)
- Monitor cron job execution logs
- Set up failure alerts
- Use multiple monitoring services for redundancy

### ❌ DON'T:
- Ping more frequently than every 3 minutes (unnecessary load)
- Use only one monitoring service (single point of failure)
- Ignore failure notifications
- Forget to test after setup

---

## Cost Comparison

| Service | Free Tier | Interval | Alerts | Recommended |
|---------|-----------|----------|--------|-------------|
| cron-job.org | ✅ Unlimited | 1 min | ✅ Email | ⭐⭐⭐⭐⭐ |
| UptimeRobot | ✅ 50 monitors | 5 min | ✅ Email | ⭐⭐⭐⭐ |
| Better Uptime | ✅ 10 monitors | 3 min | ✅ Email/SMS | ⭐⭐⭐⭐ |
| Self-Hosted | ✅ Free | Custom | ❌ Manual | ⭐⭐⭐ |

---

## Additional Improvements

### 1. Enhanced Retry Logic (Already Implemented)
The frontend now automatically retries failed requests up to 3 times with exponential backoff.

### 2. Database Connection Pooling (Already Implemented)
Backend uses connection pooling (20 connections) to handle temporary disconnections.

### 3. Health Check Monitoring (Already Implemented)
Enhanced health endpoint checks both API and database status.

---

## Support

If you continue experiencing issues after setting up keep-alive:

1. Check Render logs: `https://dashboard.render.com`
2. Verify MongoDB Atlas status: `https://cloud.mongodb.com`
3. Test health endpoint manually
4. Review cron job execution history

---

## Summary

**Quick Setup (5 minutes):**
1. Go to [cron-job.org](https://cron-job.org)
2. Create account
3. Add cron job with your backend URL
4. Set interval to 5 minutes
5. Activate and verify

**Result:**
- ✅ No more "report cannot be accessed" errors
- ✅ Backend stays awake 24/7
- ✅ Instant response times
- ✅ Better user experience
