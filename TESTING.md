# 🧪 Testing Guide - Ward 26 Problem Reporting System

Complete testing checklist to ensure all features work correctly.

## 📋 Pre-Testing Setup

1. ✅ Backend server running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ MongoDB connected
4. ✅ Admin users seeded

## 🔐 Authentication Testing

### User Registration
- [ ] Navigate to homepage
- [ ] Click "সমস্যা রিপোর্ট করুন" or "ব্যবহারকারী লগইন"
- [ ] Click "রেজিস্টার করুন"
- [ ] Fill form with:
  - নাম: Test User
  - মোবাইল: 01712345678
  - ইমেইল: test@example.com (optional)
  - পাসওয়ার্ড: test123456
  - পাসওয়ার্ড নিশ্চিত: test123456
- [ ] Click "রেজিস্টার করুন"
- [ ] Verify success message
- [ ] Verify redirect to categories page

### User Login
- [ ] Logout if logged in
- [ ] Click "ব্যবহারকারী লগইন"
- [ ] Enter phone: 01712345678
- [ ] Enter password: test123456
- [ ] Click "লগইন করুন"
- [ ] Verify success message
- [ ] Verify redirect to categories page

### Admin Login
- [ ] Navigate to `/admin/login`
- [ ] Enter email: admin1@ward26.gov.bd
- [ ] Enter password: admin123456
- [ ] Click "অ্যাডমিন লগইন"
- [ ] Verify redirect to admin dashboard

### Authentication Errors
- [ ] Try login with wrong password - should show error
- [ ] Try login with non-existent phone - should show error
- [ ] Try registering with existing phone - should show error
- [ ] Try accessing `/categories` without login - should redirect to login

## 📝 Problem Reporting Testing

### Electricity Problem (বিদ্যুৎ সমস্যা)
- [ ] Login as user
- [ ] Click "বিদ্যুৎ সমস্যা" category
- [ ] Select subcategory: "আলো জ্বলছে না"
- [ ] Enter poll number: "P-123"
- [ ] Enter description: "রাস্তার আলো ৩ দিন ধরে জ্বলছে না"
- [ ] Enter location: "মিরপুর ১০, ঢাকা"
- [ ] Click "GPS ব্যবহার করুন" (if browser supports)
- [ ] Upload 2-3 images
- [ ] Click "জমা দিন"
- [ ] Verify success message
- [ ] Verify redirect to "My Reports"

### Drainage Problem (নর্দমা সমস্যা)
- [ ] Go back to categories
- [ ] Click "নর্দমা সমস্যা"
- [ ] Select subcategory: "ডার্টি ড্রেন"
- [ ] Enter description: "নর্দমা পরিষ্কার করা প্রয়োজন"
- [ ] Enter location: "মিরপুর ১১, ঢাকা"
- [ ] Upload images (optional)
- [ ] Submit and verify

### Road Problem (রাস্তাঘাট সমস্যা)
- [ ] Click "রাস্তাঘাট সমস্যা"
- [ ] Select subcategory: "রাস্তা ভাঙা"
- [ ] Enter description: "রাস্তায় বড় গর্ত"
- [ ] Enter location: "মিরপুর ১২, ঢাকা"
- [ ] Submit and verify

### Festival (উৎসব)
- [ ] Click "উৎসব"
- [ ] Select subcategory: "কমিটি পূজা"
- [ ] Select festival date: (future date)
- [ ] Enter requirements: "মাইক, লাইট, নিরাপত্তা"
- [ ] Enter description: "দুর্গা পূজা আয়োজন"
- [ ] Enter location: "মিরপুর কমিউনিটি সেন্টার"
- [ ] Submit and verify

### Other (অন্যান্য)
- [ ] Click "অন্যান্য"
- [ ] Select subcategory: "সাধারণ সমস্যা"
- [ ] Enter description: "পার্কে আলো প্রয়োজন"
- [ ] Enter location: "মিরপুর পার্ক"
- [ ] Submit and verify

### Image Upload Testing
- [ ] Try uploading 6 images - should show warning (max 5)
- [ ] Upload 5 images successfully
- [ ] Verify image preview shows
- [ ] Remove an image using × button
- [ ] Verify image is removed from preview

### GPS Location Testing
- [ ] Click "GPS ব্যবহার করুন"
- [ ] Allow location access in browser
- [ ] Verify success message "লোকেশন সংগ্রহ করা হয়েছে"
- [ ] Verify green checkmark appears

### Form Validation
- [ ] Try submitting without subcategory - should show error
- [ ] Try submitting without description - should show error
- [ ] Try submitting without location - should show error

## 📊 My Reports Testing

### View Reports
- [ ] Click "আমার রিপোর্টসমূহ দেখুন"
- [ ] Verify all submitted reports are displayed
- [ ] Check report details:
  - [ ] Category name in Bengali
  - [ ] Subcategory
  - [ ] Description
  - [ ] Location
  - [ ] Status badge (অপেক্ষমাণ)
  - [ ] Date

### Filter Reports
- [ ] Click "সব" - shows all reports
- [ ] Click "অপেক্ষমাণ" - shows pending reports
- [ ] Click "চলমান" - shows in-progress reports
- [ ] Click "সমাধান হয়েছে" - shows resolved reports

### Report Details
- [ ] Verify images are displayed (if uploaded)
- [ ] Verify poll number shows (for electricity)
- [ ] Verify festival date shows (for festival)
- [ ] Verify admin notes show (if added by admin)

## 👨‍💼 Admin Dashboard Testing

### Dashboard Overview
- [ ] Login as admin
- [ ] Verify statistics cards show:
  - [ ] Total problems count
  - [ ] Pending count
  - [ ] In Progress count
  - [ ] Resolved count
- [ ] Verify counts are accurate

### View All Problems
- [ ] Verify table shows all problems
- [ ] Check table columns:
  - [ ] ID (last 6 characters)
  - [ ] Category (Bengali)
  - [ ] Description (truncated)
  - [ ] Reporter name and phone
  - [ ] Date
  - [ ] Status badge
  - [ ] Action button

### Filter Problems
- [ ] Click "সব" - shows all
- [ ] Click "অপেক্ষমাণ" - filters pending
- [ ] Click "চলমান" - filters in-progress
- [ ] Click "সমাধান হয়েছে" - filters resolved

### Update Problem Status
- [ ] Click "আপডেট করুন" on a problem
- [ ] Verify modal opens with problem details
- [ ] Verify images are displayed
- [ ] Change status to "চলমান"
- [ ] Add admin note: "কাজ শুরু হয়েছে"
- [ ] Click "আপডেট করুন"
- [ ] Verify success message
- [ ] Verify modal closes
- [ ] Verify table updates with new status
- [ ] Verify statistics update

### Resolve Problem
- [ ] Click "আপডেট করুন" on in-progress problem
- [ ] Change status to "সমাধান হয়েছে"
- [ ] Add note: "সমস্যা সমাধান করা হয়েছে"
- [ ] Submit and verify
- [ ] Check if resolved date is set

### Modal Testing
- [ ] Open update modal
- [ ] Click "বাতিল করুন" - modal should close
- [ ] Click outside modal - modal should stay open
- [ ] Verify all problem details are visible

## 🔔 Notification Testing (If Configured)

### Email Notifications
- [ ] Configure email in `.env`
- [ ] Submit a new problem as user
- [ ] Check admin email inbox
- [ ] Verify email received with:
  - [ ] Problem category
  - [ ] Description
  - [ ] Location
  - [ ] User details
  - [ ] Timestamp

### SMS Notifications (If Configured)
- [ ] Configure Twilio in `.env`
- [ ] Submit a new problem
- [ ] Check admin phone for SMS
- [ ] Verify SMS contains problem summary

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all elements are visible and usable

### Navigation
- [ ] Test "ফিরে যান" buttons
- [ ] Test logout functionality
- [ ] Test navigation between pages
- [ ] Verify protected routes redirect to login

### Visual Elements
- [ ] Verify Bengali fonts display correctly
- [ ] Check blue and white color scheme
- [ ] Verify icons display properly
- [ ] Check button hover effects
- [ ] Verify card shadows and animations

### Loading States
- [ ] Check spinner shows during login
- [ ] Check spinner shows during registration
- [ ] Check spinner shows during form submission
- [ ] Check spinner shows while loading reports

### Error Messages
- [ ] Verify error messages are in Bengali
- [ ] Check toast notifications appear
- [ ] Verify error styling (red color)
- [ ] Check success styling (green color)

## 🔒 Security Testing

### Protected Routes
- [ ] Try accessing `/categories` without login
- [ ] Try accessing `/admin/dashboard` without admin login
- [ ] Try accessing `/my-reports` without login
- [ ] Verify all redirect to appropriate login page

### JWT Token
- [ ] Login and check localStorage for token
- [ ] Logout and verify token is removed
- [ ] Try making API call without token - should fail

### Input Validation
- [ ] Try SQL injection in forms
- [ ] Try XSS attacks in text fields
- [ ] Verify file upload restrictions (size, type)

## 📱 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance Testing

- [ ] Check page load times (should be < 3 seconds)
- [ ] Test with 50+ problems in database
- [ ] Verify image loading is optimized
- [ ] Check for memory leaks (long session)

## 🐛 Bug Testing Scenarios

### Edge Cases
- [ ] Submit form with very long description (1000+ chars)
- [ ] Upload maximum size images (5MB each)
- [ ] Create 100+ reports from one user
- [ ] Test with special characters in Bengali text
- [ ] Test with emojis in description
- [ ] Test rapid clicking on submit button

### Network Issues
- [ ] Test with slow 3G connection
- [ ] Test with intermittent connection
- [ ] Verify error handling for network failures

## ✅ Final Checklist

- [ ] All authentication flows work
- [ ] All problem categories can be submitted
- [ ] Images upload successfully
- [ ] GPS location works
- [ ] My Reports page displays correctly
- [ ] Admin dashboard functions properly
- [ ] Status updates work
- [ ] Filters work correctly
- [ ] Responsive design works on all devices
- [ ] No console errors
- [ ] No broken images or links
- [ ] Bengali text displays correctly
- [ ] Notifications work (if configured)

## 📝 Test Report Template

```
Date: ___________
Tester: ___________
Environment: Development / Production

✅ Passed Tests: ___/___
❌ Failed Tests: ___/___

Critical Issues:
1. 
2. 

Minor Issues:
1. 
2. 

Recommendations:
1. 
2. 

Overall Status: PASS / FAIL
```

## 🎉 Testing Complete!

If all tests pass, your application is ready for deployment!

**"আমার এলাকা, আমার দায়িত্ব"**
