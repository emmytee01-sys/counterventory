const ExcelJS = require('exceljs');
const MasterInventory = require('../models/MasterInventory');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Export user inventory to Excel
// @route   GET /api/admin/export/user/:userId
// @access  Private/Admin
exports.exportUserInventory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user info
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all submitted inventory for user
    const inventory = await MasterInventory.find({ userId })
      .populate('productId')
      .populate('userId', 'username')
      .sort({ submittedAt: -1 });

    if (inventory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No inventory data found for this user'
      });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    // Add header - matching your CSV format
    worksheet.columns = [
      { header: 'ProductSKU', key: 'productSKU', width: 15 },
      { header: 'RecordUID', key: 'recordUID', width: 15 },
      { header: 'DeptName', key: 'deptName', width: 20 },
      { header: 'ItemName', key: 'itemName', width: 40 },
      { header: 'ItemDetailedSpecs', key: 'itemDetailedSpecs', width: 40 },
      { header: 'SellingPrice', key: 'sellingPrice', width: 15 },
      { header: 'CostPrice', key: 'costPrice', width: 15 },
      { header: 'CurrentStock(QTY)', key: 'currentStock', width: 18 },
      { header: 'CaseQuantity(CTN)', key: 'caseQuantity', width: 18 },
      { header: 'UPC(BARCODE)', key: 'upcBarcode', width: 20 },
      { header: 'AlternateLookupBarcode(ALPHANUMERIC)', key: 'alternateLookupBarcode', width: 35 },
      { header: 'CountedQuantity', key: 'countedQuantity', width: 18 },
      { header: 'CountedBy', key: 'countedBy', width: 20 },
      { header: 'CountedDate', key: 'countedDate', width: 20 },
      { header: 'BatchID', key: 'batchId', width: 30 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C4A68' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data - matching your CSV format
    inventory.forEach(item => {
      const product = item.productId;
      worksheet.addRow({
        productSKU: product.productSKU || '',
        recordUID: product.recordUID || '',
        deptName: product.deptName || '',
        itemName: product.itemName || '',
        itemDetailedSpecs: product.itemDetailedSpecs || '',
        sellingPrice: product.sellingPrice || 0,
        costPrice: product.costPrice || 0,
        currentStock: product.currentStock || 0,
        caseQuantity: product.caseQuantity || 1,
        upcBarcode: product.upcBarcode || '',
        alternateLookupBarcode: product.alternateLookupBarcode || '',
        countedQuantity: item.quantity,
        countedBy: item.userId.username,
        countedDate: item.submittedAt.toLocaleString(),
        batchId: item.batchId
      });
    });

    // Add totals row
    const lastRow = worksheet.lastRow.number + 2;
    worksheet.getCell(`K${lastRow}`).value = 'TOTALS:';
    worksheet.getCell(`K${lastRow}`).font = { bold: true };

    const totalQty = inventory.reduce((sum, item) => sum + item.quantity, 0);

    worksheet.getCell(`L${lastRow}`).value = totalQty;
    worksheet.getCell(`L${lastRow}`).font = { bold: true };

    // Generate filename
    const filename = `inventory_${user.username}_${Date.now()}.xlsx`;
    const filepath = path.join(__dirname, '../exports', filename);

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Write to file
    await workbook.xlsx.writeFile(filepath);

    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Delete file after sending
      fs.unlinkSync(filepath);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Export all inventory to Excel
// @route   GET /api/admin/export/all
// @access  Private/Admin
exports.exportAllInventory = async (req, res) => {
  try {
    // Get all submitted inventory
    const inventory = await MasterInventory.find()
      .populate('productId')
      .populate('userId', 'username')
      .sort({ submittedAt: -1 });

    if (inventory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No inventory data found'
      });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Inventory');

    // Add header - matching your CSV format
    worksheet.columns = [
      { header: 'ProductSKU', key: 'productSKU', width: 15 },
      { header: 'RecordUID', key: 'recordUID', width: 15 },
      { header: 'DeptName', key: 'deptName', width: 20 },
      { header: 'ItemName', key: 'itemName', width: 40 },
      { header: 'ItemDetailedSpecs', key: 'itemDetailedSpecs', width: 40 },
      { header: 'SellingPrice', key: 'sellingPrice', width: 15 },
      { header: 'CostPrice', key: 'costPrice', width: 15 },
      { header: 'CurrentStock(QTY)', key: 'currentStock', width: 18 },
      { header: 'CaseQuantity(CTN)', key: 'caseQuantity', width: 18 },
      { header: 'UPC(BARCODE)', key: 'upcBarcode', width: 20 },
      { header: 'AlternateLookupBarcode(ALPHANUMERIC)', key: 'alternateLookupBarcode', width: 35 },
      { header: 'CountedQuantity', key: 'countedQuantity', width: 18 },
      { header: 'CountedBy', key: 'countedBy', width: 20 },
      { header: 'CountedDate', key: 'countedDate', width: 20 },
      { header: 'BatchID', key: 'batchId', width: 30 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C4A68' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data - matching your CSV format
    inventory.forEach(item => {
      const product = item.productId;
      worksheet.addRow({
        productSKU: product.productSKU || '',
        recordUID: product.recordUID || '',
        deptName: product.deptName || '',
        itemName: product.itemName || '',
        itemDetailedSpecs: product.itemDetailedSpecs || '',
        sellingPrice: product.sellingPrice || 0,
        costPrice: product.costPrice || 0,
        currentStock: product.currentStock || 0,
        caseQuantity: product.caseQuantity || 1,
        upcBarcode: product.upcBarcode || '',
        alternateLookupBarcode: product.alternateLookupBarcode || '',
        countedQuantity: item.quantity,
        countedBy: item.userId.username,
        countedDate: item.submittedAt.toLocaleString(),
        batchId: item.batchId
      });
    });

    // Add totals row
    const lastRow = worksheet.lastRow.number + 2;
    worksheet.getCell(`K${lastRow}`).value = 'TOTALS:';
    worksheet.getCell(`K${lastRow}`).font = { bold: true };

    const totalQty = inventory.reduce((sum, item) => sum + item.quantity, 0);

    worksheet.getCell(`L${lastRow}`).value = totalQty;
    worksheet.getCell(`L${lastRow}`).font = { bold: true };

    // Generate filename
    const filename = `inventory_all_${Date.now()}.xlsx`;
    const filepath = path.join(__dirname, '../exports', filename);

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Write to file
    await workbook.xlsx.writeFile(filepath);

    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Delete file after sending
      fs.unlinkSync(filepath);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all users with their count statistics
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');

    // Get count statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const submittedCount = await MasterInventory.countDocuments({ userId: user._id });
        const submittedTotal = await MasterInventory.aggregate([
          { $match: { userId: user._id } },
          { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);

        return {
          id: user._id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          submittedItems: submittedCount,
          submittedQuantity: submittedTotal[0]?.total || 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user - hashing handled by model middleware
    const user = await User.create({
      username,
      password,
      role: role || 'staff'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role
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

// @desc    Download sample product import file
// @route   GET /api/admin/sample
// @access  Private/Admin
exports.getSampleFile = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sample Import');

    // Add headers based on Product model
    worksheet.columns = [
      { header: 'productSKU', key: 'productSKU', width: 15 },
      { header: 'itemName', key: 'itemName', width: 30 },
      { header: 'deptName', key: 'deptName', width: 20 },
      { header: 'itemDetailedSpecs', key: 'itemDetailedSpecs', width: 30 },
      { header: 'sellingPrice', key: 'sellingPrice', width: 15 },
      { header: 'costPrice', key: 'costPrice', width: 15 },
      { header: 'currentStock', key: 'currentStock', width: 15 },
      { header: 'upcBarcode', key: 'upcBarcode', width: 20 },
      { header: 'recordUID', key: 'recordUID', width: 15 }
    ];

    // Add some sample data
    worksheet.addRow({
      productSKU: 'SKU123',
      itemName: 'Sample Product',
      deptName: 'GROCERY',
      itemDetailedSpecs: '500g Pack',
      sellingPrice: 10.99,
      costPrice: 8.50,
      currentStock: 100,
      upcBarcode: '123456789012',
      recordUID: 'UID001'
    });

    const filename = 'sample_import.xlsx';
    const filepath = path.join(__dirname, '../exports', filename);

    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    await workbook.xlsx.writeFile(filepath);

    res.download(filepath, filename, (err) => {
      if (!err) fs.unlinkSync(filepath);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

