const TemporaryCount = require('../models/TemporaryCount');
const MasterInventory = require('../models/MasterInventory');
const Product = require('../models/Product');

// @desc    Save temporary count
// @route   POST /api/counts/temp
// @access  Private
exports.saveTempCount = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if count already exists for this user and product
    let count = await TemporaryCount.findOne({
      userId: req.user.id,
      productId
    });

    if (count) {
      // Update existing count
      count.quantity = quantity;
      count.price = price;
      count.synced = true;
      await count.save();
    } else {
      // Create new count
      count = await TemporaryCount.create({
        userId: req.user.id,
        productId,
        quantity,
        price,
        synced: true
      });
    }

    // Populate product details
    await count.populate('productId');

    res.status(200).json({
      success: true,
      data: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get temporary counts for user
// @route   GET /api/counts/temp/:userId
// @access  Private
exports.getTempCounts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Only allow users to see their own counts, or admins to see any
    if (req.user.role !== 'admin' && userId !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const counts = await TemporaryCount.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: counts.length,
      data: counts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete temporary count
// @route   DELETE /api/counts/temp/:id
// @access  Private
exports.deleteTempCount = async (req, res) => {
  try {
    const count = await TemporaryCount.findById(req.params.id);

    if (!count) {
      return res.status(404).json({
        success: false,
        message: 'Count not found'
      });
    }

    // Only allow users to delete their own counts, or admins to delete any
    if (req.user.role !== 'admin' && count.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await count.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Count deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit temporary counts to master inventory
// @route   POST /api/counts/submit/:userId
// @access  Private
exports.submitCounts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Only allow users to submit their own counts
    if (userId !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get all temporary counts for user
    const tempCounts = await TemporaryCount.find({ userId });

    if (tempCounts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No counts to submit'
      });
    }

    // Generate batch ID
    const batchId = `BATCH_${userId}_${Date.now()}`;

    // Move to master inventory
    const masterRecords = tempCounts.map(count => ({
      userId: count.userId,
      productId: count.productId,
      quantity: count.quantity,
      price: count.price,
      batchId,
      submittedAt: new Date()
    }));

    await MasterInventory.insertMany(masterRecords);

    // Delete temporary counts
    await TemporaryCount.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Counts submitted successfully',
      batchId,
      count: masterRecords.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get submitted counts (for dashboard stats)
// @route   GET /api/counts/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Temporary counts (today)
    const tempCounts = await TemporaryCount.find({ userId });
    const totalItems = tempCounts.length;
    const totalQuantity = tempCounts.reduce((sum, count) => sum + count.quantity, 0);

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalQuantity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

