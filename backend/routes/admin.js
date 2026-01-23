const express = require('express');
const {
  exportUserInventory,
  exportAllInventory,
  getAllUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/export/user/:userId', exportUserInventory);
router.get('/export/all', exportAllInventory);

module.exports = router;

