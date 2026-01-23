const express = require('express');
const {
  saveTempCount,
  getTempCounts,
  deleteTempCount,
  submitCounts,
  getStats
} = require('../controllers/countController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/temp', protect, saveTempCount);
router.get('/temp/:userId', protect, getTempCounts);
router.delete('/temp/:id', protect, deleteTempCount);
router.post('/submit/:userId', protect, submitCounts);
router.get('/stats', protect, getStats);

module.exports = router;

