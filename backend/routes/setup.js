const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// @desc    Initial setup - seed database (ONE TIME USE)
// @route   GET /api/setup/seed?secret=YOUR_SECRET
// @access  Public (but requires secret key)
router.get('/seed', async (req, res) => {
  try {
    // Security: require secret key
    const secret = req.query.secret;
    if (secret !== process.env.SETUP_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or missing secret key'
      });
    }

    // Check if already seeded
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({
        success: false,
        message: 'Database already seeded. Delete users first if you want to re-seed.'
      });
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      passwordHash: 'admin123',
      role: 'admin'
    });

    // Create test users
    await User.create({
      username: 'john',
      passwordHash: 'password123',
      role: 'user'
    });

    await User.create({
      username: 'jane',
      passwordHash: 'password123',
      role: 'user'
    });

    // Create sample products
    const products = [
      {
        productSKU: '1001',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'KELLOGG\'S MOONS & STARS CHOCO CEREALS 900G',
        itemDetailedSpecs: 'KELLOGG\'S MOONS & STARS CHOCO CEREALS 900G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 18,
        caseQuantity: 1,
        upcBarcode: '615400000001',
        alternateLookupBarcode: '615400000001'
      },
      {
        productSKU: '1002',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'KELLOG\'S COCO POPS REFILL 900G',
        itemDetailedSpecs: 'KELLOG\'S COCO POPS REFILL 900G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 10,
        caseQuantity: 1,
        upcBarcode: '615400000002',
        alternateLookupBarcode: '615400000002'
      },
      {
        productSKU: '1003',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'KELLOG\'S CORNFLAKES POUNCH 400G',
        itemDetailedSpecs: 'KELLOG\'S CORNFLAKES POUNCH 400G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 24,
        caseQuantity: 1,
        upcBarcode: '615400000003',
        alternateLookupBarcode: '615400000003'
      },
      {
        productSKU: '101',
        recordUID: '',
        deptName: 'VILLAGE MARKET',
        itemName: 'CARROT',
        itemDetailedSpecs: 'CARROT',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 15,
        caseQuantity: 1,
        upcBarcode: '215879',
        alternateLookupBarcode: '215879'
      },
      {
        productSKU: '102',
        recordUID: '',
        deptName: 'VILLAGE MARKET',
        itemName: 'CAP RICE 50KG (SHORT GRAIN)',
        itemDetailedSpecs: 'CAP RICE 50KG (SHORT GRAIN)',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 15,
        caseQuantity: 1,
        upcBarcode: '2225896',
        alternateLookupBarcode: '2225896'
      },
      {
        productSKU: '1024',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'GOLDEN PENNY WHITE CUBE SUGAR 500G',
        itemDetailedSpecs: 'GOLDEN PENNY WHITE CUBE SUGAR 500G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 60,
        caseQuantity: 1,
        upcBarcode: '615600000024',
        alternateLookupBarcode: '615600000024'
      },
      {
        productSKU: '1025',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'GOLDEN PENNY SUGAR 1KG',
        itemDetailedSpecs: 'GOLDEN PENNY SUGAR 1KG',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 31,
        caseQuantity: 1,
        upcBarcode: '615600000025',
        alternateLookupBarcode: '615600000025'
      },
      {
        productSKU: '1034',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'DANGOTE GRANULATED SUGAR 250G',
        itemDetailedSpecs: 'DANGOTE GRANULATED SUGAR 250G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 190,
        caseQuantity: 1,
        upcBarcode: '615600000034',
        alternateLookupBarcode: '615600000034'
      },
      {
        productSKU: '1035',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'DANGOTE GRANULATED SUGAR 500G',
        itemDetailedSpecs: 'DANGOTE GRANULATED SUGAR 500G',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 105,
        caseQuantity: 1,
        upcBarcode: '615600000035',
        alternateLookupBarcode: '615600000035'
      },
      {
        productSKU: '1036',
        recordUID: '',
        deptName: 'PROVISIONS',
        itemName: 'DANGOTE GRANULATED SUGAR 1KG',
        itemDetailedSpecs: 'DANGOTE GRANULATED SUGAR 1KG',
        sellingPrice: 0,
        costPrice: 0,
        currentStock: 84,
        caseQuantity: 1,
        upcBarcode: '615600000036',
        alternateLookupBarcode: '615600000036'
      }
    ];

    await Product.insertMany(products);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: 3,
        products: products.length,
        credentials: {
          admin: 'admin / admin123',
          user1: 'john / password123',
          user2: 'jane / password123'
        },
        sampleBarcodes: ['615400000001', '615400000002', '215879', '2225896']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    });
  }
});

module.exports = router;

