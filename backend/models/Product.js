const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Core identifiers
  productSKU: {
    type: String,
    required: [true, 'Product SKU is required'],
    unique: true,
    trim: true
  },
  recordUID: {
    type: String,
    default: '',
    trim: true
  },
  
  // Product information
  deptName: {
    type: String,
    default: '',
    trim: true
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  itemDetailedSpecs: {
    type: String,
    default: '',
    trim: true
  },
  
  // Pricing
  sellingPrice: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    default: 0
  },
  
  // Stock information
  currentStock: {
    type: Number,
    default: 0
  },
  caseQuantity: {
    type: Number,
    default: 1
  },
  
  // Barcodes
  upcBarcode: {
    type: String,
    default: '',
    trim: true,
    index: true  // For QR scanning
  },
  alternateLookupBarcode: {
    type: String,
    default: '',
    trim: true,
    index: true  // For alternate scanning
  },
  
  // Additional fields
  productVariant: {
    type: String,
    default: ''
  },
  dimensionScale: {
    type: String,
    default: ''
  },
  
  // Alternative keys
  altKeyAlpha: {
    type: String,
    default: ''
  },
  altKeyBeta: {
    type: String,
    default: ''
  },
  altKeyGamma: {
    type: String,
    default: ''
  },
  altKeyDelta: {
    type: String,
    default: ''
  },
  altKeyEpsilon: {
    type: String,
    default: ''
  },
  altKeyZeta: {
    type: String,
    default: ''
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

// Index for barcode searching
productSchema.index({ upcBarcode: 1 });
productSchema.index({ alternateLookupBarcode: 1 });

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);

