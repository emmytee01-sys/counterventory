const Product = require('../models/Product');

// @desc    Get product by QR code (barcode)
// @route   GET /api/products/qr/:code
// @access  Private
exports.getProductByQR = async (req, res) => {
  try {
    // Search by UPC barcode or alternate barcode or product SKU
    const product = await Product.findOne({
      $or: [
        { upcBarcode: req.params.code },
        { alternateLookupBarcode: req.params.code },
        { productSKU: req.params.code }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ itemName: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create product (Admin only - for initial setup)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk import products from CSV
// @route   POST /api/products/import
// @access  Private/Admin
exports.importProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const productData of products) {
      try {
        // Check if product exists
        const existing = await Product.findOne({ productSKU: productData.productSKU });
        
        if (existing) {
          // Update existing product
          Object.assign(existing, productData);
          await existing.save();
          results.success++;
        } else {
          // Create new product
          await Product.create(productData);
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          sku: productData.productSKU,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Imported ${results.success} products, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

