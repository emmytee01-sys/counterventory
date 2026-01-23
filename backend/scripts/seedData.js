const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      passwordHash: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created:', admin.username);

    // Create test users
    const user1 = await User.create({
      username: 'john',
      passwordHash: 'password123',
      role: 'user'
    });

    const user2 = await User.create({
      username: 'jane',
      passwordHash: 'password123',
      role: 'user'
    });

    console.log('Test users created');

    // Create sample products
    const products = [
      {
        qrCode: 'QR001',
        name: 'Laptop Dell XPS 15',
        sku: 'DELL-XPS-15',
        category: 'Electronics'
      },
      {
        qrCode: 'QR002',
        name: 'iPhone 15 Pro',
        sku: 'APPLE-IP15P',
        category: 'Electronics'
      },
      {
        qrCode: 'QR003',
        name: 'Samsung Galaxy S24',
        sku: 'SAMSUNG-S24',
        category: 'Electronics'
      },
      {
        qrCode: 'QR004',
        name: 'Wireless Mouse',
        sku: 'MOUSE-001',
        category: 'Accessories'
      },
      {
        qrCode: 'QR005',
        name: 'USB-C Cable',
        sku: 'CABLE-USBC',
        category: 'Accessories'
      },
      {
        qrCode: 'QR006',
        name: 'Mechanical Keyboard',
        sku: 'KB-MECH-001',
        category: 'Accessories'
      },
      {
        qrCode: 'QR007',
        name: 'Monitor 27 inch',
        sku: 'MON-27-001',
        category: 'Electronics'
      },
      {
        qrCode: 'QR008',
        name: 'Webcam HD',
        sku: 'CAM-HD-001',
        category: 'Electronics'
      },
      {
        qrCode: 'QR009',
        name: 'External SSD 1TB',
        sku: 'SSD-1TB',
        category: 'Storage'
      },
      {
        qrCode: 'QR010',
        name: 'Headphones Wireless',
        sku: 'HP-WL-001',
        category: 'Audio'
      }
    ];

    await Product.insertMany(products);

    console.log('Sample products created');
    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('\nLogin Credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('User1: username=john, password=password123');
    console.log('User2: username=jane, password=password123');
    console.log('\nSample QR Codes: QR001 to QR010');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

