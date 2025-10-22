const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '২৬ নম্বর ওয়ার্ড API চালু আছে',
    timestamp: new Date().toISOString()
  });
});

// WhatsApp test route
app.post('/api/test-whatsapp', async (req, res) => {
  try {
    const { sendWhatsAppNotification } = require('./utils/notifications');
    
    const testData = {
      category: 'electricity',
      subcategory: 'বিদ্যুৎ বিভ্রাট',
      description: 'API পরীক্ষামূলক বার্তা',
      location: {
        address: 'ঢাকা, বাংলাদেশ'
      },
      userName: 'API পরীক্ষা',
      userPhone: '+8801712345678',
      userEmail: 'test@example.com',
      createdAt: new Date()
    };
    
    const result = await sendWhatsAppNotification(testData);
    
    res.json({
      success: result,
      message: result ? 'WhatsApp notification sent successfully' : 'Failed to send WhatsApp notification'
    });
  } catch (error) {
    console.error('WhatsApp test error:', error);
    res.status(500).json({
      success: false,
      message: 'WhatsApp test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'সার্ভার এরর',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'রাউট পাওয়া যায়নি' });
});

// MongoDB connection (use local MongoDB)
const connectDB = async () => {
  try {
    const localMongoURI = 'mongodb://localhost:27017/ward26db';
    const conn = await mongoose.connect(localMongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Starting server without database connection...');
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  ২৬ নম্বর ওয়ার্ড - সার্ভার চালু আছে      ║
    ║  Port: ${PORT}                              ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}              ║
    ║  WhatsApp Test: POST /api/test-whatsapp    ║
    ╚════════════════════════════════════════════╝
    `);
  });
}).catch(() => {
  // Start server even if DB connection fails
  app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  ২৬ নম্বর ওয়ার্ড - সার্ভার চালু আছে      ║
    ║  Port: ${PORT} (No Database)               ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}              ║
    ║  WhatsApp Test: POST /api/test-whatsapp    ║
    ╚════════════════════════════════════════════╝
    `);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
