const mongoose = require('mongoose');

const masterInventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  batchId: {
    type: String,
    required: true
  }
});

// Composite index for faster queries
masterInventorySchema.index({ userId: 1, submittedAt: -1 });
masterInventorySchema.index({ batchId: 1 });

module.exports = mongoose.model('MasterInventory', masterInventorySchema);

