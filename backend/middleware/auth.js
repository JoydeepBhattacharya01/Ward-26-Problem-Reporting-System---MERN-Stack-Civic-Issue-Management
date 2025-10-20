const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'অনুমোদন ব্যর্থ হয়েছে' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'টোকেন পাওয়া যায়নি, অনুমোদন অস্বীকৃত' });
  }
};

// Admin authorization
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন' });
  }
};
