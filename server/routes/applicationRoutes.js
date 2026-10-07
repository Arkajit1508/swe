const express = require('express');
const router = express.Router();
const {
  getMyApplication,
  saveDraft,
  submitApplication,
  getApplicationById,
  getApplicationByAppNumber
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/track/:appNumber', getApplicationByAppNumber);
router.get('/me', protect, getMyApplication);
router.post('/draft', protect, saveDraft);
router.put('/:id', protect, saveDraft);
router.post('/:id/submit', protect, submitApplication);
router.get('/:id', protect, getApplicationById);

module.exports = router;
