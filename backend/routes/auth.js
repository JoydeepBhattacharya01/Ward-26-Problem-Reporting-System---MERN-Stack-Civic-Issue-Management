const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('নাম প্রয়োজন'),
  body('phone').notEmpty().withMessage('মোবাইল নাম্বার প্রয়োজন'),
  body('password').isLength({ min: 6 }).withMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      isAdmin: false
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('phone').notEmpty().withMessage('মোবাইল নাম্বার প্রয়োজন'),
  body('password').notEmpty().withMessage('পাসওয়ার্ড প্রয়োজন')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'ভুল মোবাইল নাম্বার বা পাসওয়ার্ড' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'লগইন ব্যর্থ হয়েছে' });
  }
});

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', [
  body('email').isEmail().withMessage('সঠিক ইমেইল প্রয়োজন'),
  body('password').notEmpty().withMessage('পাসওয়ার্ড প্রয়োজন')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find admin user by email
    const user = await User.findOne({ email, isAdmin: true });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'ভুল ইমেইল বা পাসওয়ার্ড' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'লগইন ব্যর্থ হয়েছে' });
  }
});

module.exports = router;
