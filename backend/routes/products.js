const express = require('express');
const {
  getProductByQR,
  getProducts,
  createProduct,
  importProducts,
  clearProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/qr/:code', protect, getProductByQR);
router.post('/', protect, authorize('admin'), createProduct);
router.post('/import', protect, authorize('admin'), importProducts);
router.delete('/clear', protect, authorize('admin'), clearProducts);

module.exports = router;

