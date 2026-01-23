const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load env vars
dotenv.config();

// Parse CSV function
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length < headers.length) continue; // Skip incomplete rows
    
    const product = {
      productSKU: values[0] || '',
      recordUID: values[1] || '',
      deptName: values[2] || '',
      itemName: values[3] || '',
      itemDetailedSpecs: values[4] || '',
      sellingPrice: parseFloat(values[5]) || 0,
      costPrice: parseFloat(values[6]) || 0,
      currentStock: parseFloat(values[7]) || 0,
      caseQuantity: parseFloat(values[8]) || 1,
      upcBarcode: values[9] || '',
      alternateLookupBarcode: values[10] || '',
      productVariant: values[11] || '',
      dimensionScale: values[12] || '',
      altKeyAlpha: values[13] || '',
      altKeyBeta: values[14] || '',
      altKeyGamma: values[15] || '',
      altKeyDelta: values[16] || '',
      altKeyEpsilon: values[17] || '',
      altKeyZeta: values[18] || ''
    };
    
    if (product.productSKU) {
      products.push(product);
    }
  }
  
  return products;
}

async function importProducts() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get CSV file path from command line or use default
    const csvPath = process.argv[2] || path.join(__dirname, '../../Counterventory Import Inventory Format  - example.csv');

    console.log(`Reading CSV from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found!');
      process.exit(1);
    }

    // Parse CSV
    const products = parseCSV(csvPath);
    console.log(`Parsed ${products.length} products from CSV`);

    // Clear existing products (optional - comment out to keep existing)
    // await Product.deleteMany();
    // console.log('Cleared existing products');

    // Import products
    let success = 0;
    let failed = 0;

    for (const productData of products) {
      try {
        // Check if product exists
        const existing = await Product.findOne({ productSKU: productData.productSKU });
        
        if (existing) {
          // Update existing
          Object.assign(existing, productData);
          await existing.save();
          console.log(`Updated: ${productData.productSKU} - ${productData.itemName}`);
        } else {
          // Create new
          await Product.create(productData);
          console.log(`Created: ${productData.productSKU} - ${productData.itemName}`);
        }
        success++;
      } catch (error) {
        console.error(`Failed to import ${productData.productSKU}: ${error.message}`);
        failed++;
      }
    }

    console.log('\n=== IMPORT COMPLETE ===');
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${products.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
}

// Run import
importProducts();

