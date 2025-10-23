const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for anonymous submissions
  },
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: [
      'infrastructure_public_works',
      'waste_management_sanitation', 
      'parks_public_spaces',
      'water_sanitation_services',
      'electricity_power',
      'public_transport_traffic',
      'housing_community_facilities',
      'safety_law_enforcement',
      'education_social_services',
      'others'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    type: String // Store image paths/URLs
  }],
  // Specific fields for different categories
  pollNumber: String, // For electricity
  festivalDate: Date, // For festival
  requirements: String, // For festival
  
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
problemSchema.index({ complaintId: 1 });
problemSchema.index({ userId: 1 });
problemSchema.index({ status: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ createdAt: -1 });
problemSchema.index({ userId: 1, status: 1 });
problemSchema.index({ category: 1, status: 1 });
problemSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries

// Auto-generate complaintId before saving
problemSchema.pre('save', async function(next) {
  if (this.isNew && !this.complaintId) {
    try {
      // Get the count of existing problems and add 1000
      const count = await mongoose.model('Problem').countDocuments();
      this.complaintId = `CMP${1000 + count + 1}`;
    } catch (error) {
      return next(error);
    }
  }
  
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Problem', problemSchema);
