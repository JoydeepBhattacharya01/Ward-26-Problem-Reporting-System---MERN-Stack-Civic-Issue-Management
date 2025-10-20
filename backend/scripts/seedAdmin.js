const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected');

    // Delete existing admin users (optional)
    await User.deleteMany({ isAdmin: true });

    // Create 3 admin users
    const admins = [
      {
        name: 'Admin 1',
        email: process.env.ADMIN_EMAIL_1 || 'admin1@ward26.gov.bd',
        phone: '01700000001',
        password: 'admin123456',
        isAdmin: true
      },
      {
        name: 'Admin 2',
        email: process.env.ADMIN_EMAIL_2 || 'admin2@ward26.gov.bd',
        phone: '01700000002',
        password: 'admin123456',
        isAdmin: true
      },
      {
        name: 'Admin 3',
        email: process.env.ADMIN_EMAIL_3 || 'admin3@ward26.gov.bd',
        phone: '01700000003',
        password: 'admin123456',
        isAdmin: true
      }
    ];

    for (const adminData of admins) {
      const admin = await User.create(adminData);
      console.log(`✓ Admin created: ${admin.name} (${admin.email})`);
    }

    console.log('\n✅ Admin users seeded successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Email: admin1@ward26.gov.bd, Password: admin123456');
    console.log('Email: admin2@ward26.gov.bd, Password: admin123456');
    console.log('Email: admin3@ward26.gov.bd, Password: admin123456');
    console.log('\n⚠️  Please change these passwords in production!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

seedAdmins();
