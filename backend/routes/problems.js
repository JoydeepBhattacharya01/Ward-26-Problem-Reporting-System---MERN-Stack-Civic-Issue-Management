const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const { protect, admin } = require('../middleware/auth');
const { notifyAdmins, sendSolvedNotification } = require('../utils/notifications');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'problem-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র ছবি ফাইল আপলোড করা যাবে'));
    }
  }
});

// @route   POST /api/problems
// @desc    Create a new problem report
// @access  Private
router.post('/', protect, upload.array('images', 5), [
  body('category').notEmpty().withMessage('ক্যাটাগরি প্রয়োজন'),
  body('subcategory').notEmpty().withMessage('সাব-ক্যাটাগরি প্রয়োজন'),
  body('description').notEmpty().withMessage('বিবরণ প্রয়োজন'),
  body('location').notEmpty().withMessage('অবস্থান প্রয়োজন')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      subcategory,
      description,
      location,
      pollNumber,
      festivalDate,
      requirements
    } = req.body;

    // Parse location if it's a string
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    // Validate parsed location has address
    if (!parsedLocation || !parsedLocation.address || !parsedLocation.address.trim()) {
      return res.status(400).json({ 
        errors: [{ msg: 'অবস্থান প্রয়োজন', path: 'location.address' }] 
      });
    }

    // Get uploaded image paths
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Create problem
    const problem = await Problem.create({
      userId: req.user._id,
      userName: req.user.name,
      userPhone: req.user.phone,
      userEmail: req.user.email,
      category,
      subcategory,
      description,
      location: parsedLocation,
      images: imagePaths,
      pollNumber,
      festivalDate,
      requirements
    });

    // Send notifications to admins (non-blocking)
    setImmediate(async () => {
      try {
        await notifyAdmins(problem);
      } catch (error) {
        console.error('Notification error (non-blocking):', error);
        // Continue even if notifications fail
      }
    });

    res.status(201).json({
      message: 'সমস্যা সফলভাবে রিপোর্ট করা হয়েছে',
      problem
    });
  } catch (error) {
    console.error('Problem creation error:', error);
    res.status(500).json({ message: 'সমস্যা রিপোর্ট করতে ব্যর্থ হয়েছে' });
  }
});

// @route   GET /api/problems/search
// @desc    Search problems by complaint ID (admin only)
// @access  Private (Admin)
router.get('/search', protect, admin, async (req, res) => {
  try {
    const { complaintId } = req.query;
    
    if (!complaintId) {
      return res.status(400).json({ message: 'Complaint ID is required' });
    }

    const problem = await Problem.findOne({ complaintId: complaintId.toUpperCase() })
      .populate('userId', 'name phone email');

    if (!problem) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Search complaint error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// @route   GET /api/problems
// @desc    Get all problems (admin) or user's problems
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's own problems
    if (!req.user.isAdmin) {
      query.userId = req.user._id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Problem.countDocuments(query);

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name phone email');

    res.json({
      count: problems.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      problems
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'সমস্যা লোড করতে ব্যর্থ হয়েছে' });
  }
});

// @route   GET /api/problems/:id
// @desc    Get single problem by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('userId', 'name phone email');

    if (!problem) {
      return res.status(404).json({ message: 'সমস্যা পাওয়া যায়নি' });
    }

    // Check if user is admin or owner of the problem
    if (!req.user.isAdmin && problem.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'অ্যাক্সেস অস্বীকৃত' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'সমস্যা লোড করতে ব্যর্থ হয়েছে' });
  }
});

// @route   PUT /api/problems/:id/status
// @desc    Update problem status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, [
  body('status').isIn(['pending', 'in_progress', 'resolved']).withMessage('সঠিক স্ট্যাটাস প্রয়োজন')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, adminNotes } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'সমস্যা পাওয়া যায়নি' });
    }

    const previousStatus = problem.status;
    
    problem.status = status;
    if (adminNotes) {
      problem.adminNotes = adminNotes;
    }
    
    if (status === 'resolved') {
      problem.resolvedAt = Date.now();
    }

    await problem.save();

    // Send WhatsApp notification when status changes to resolved
    if (status === 'resolved' && previousStatus !== 'resolved') {
      try {
        await sendSolvedNotification(problem);
      } catch (error) {
        console.error('WhatsApp notification error (non-blocking):', error);
        // Continue even if WhatsApp notification fails
      }
    }

    res.json({
      message: 'স্ট্যাটাস আপডেট করা হয়েছে',
      problem
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে' });
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete a problem (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'সমস্যা পাওয়া যায়নি' });
    }

    await problem.deleteOne();

    res.json({ message: 'সমস্যা মুছে ফেলা হয়েছে' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ message: 'সমস্যা মুছতে ব্যর্থ হয়েছে' });
  }
});

// @route   GET /api/problems/stats/summary
// @desc    Get problem statistics (admin only)
// @access  Private/Admin
router.get('/stats/summary', protect, admin, async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    const pendingProblems = await Problem.countDocuments({ status: 'pending' });
    const inProgressProblems = await Problem.countDocuments({ status: 'in_progress' });
    const resolvedProblems = await Problem.countDocuments({ status: 'resolved' });

    const categoryStats = await Problem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total: totalProblems,
      pending: pendingProblems,
      inProgress: inProgressProblems,
      resolved: resolvedProblems,
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে' });
  }
});

module.exports = router;
