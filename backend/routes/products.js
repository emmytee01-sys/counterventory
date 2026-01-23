const express = require('express');
const {
  getProductByQR,
  getProducts,
  createProduct,
  importProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/qr/:code', protect, getProductByQR);
router.post('/', protect, authorize('admin'), createProduct);
router.post('/import', protect, authorize('admin'), importProducts);

module.exports = router;

