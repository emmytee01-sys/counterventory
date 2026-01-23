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

    // Create sample products matching your CSV format
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

    console.log('Sample products created (matching your CSV format)');
    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('\nLogin Credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('User1: username=john, password=password123');
    console.log('User2: username=jane, password=password123');
    console.log('\nSample Barcodes: 615400000001, 615400000002, 215879, 2225896, etc.');
    console.log('\nTo import all products from CSV:');
    console.log('node scripts/importFromCSV.js');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

