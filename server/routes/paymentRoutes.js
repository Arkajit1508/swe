const express = require('express');
const router = express.Router();
const { processMockPayment, getPaymentByApplication } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mock', protect, processMockPayment);
router.get('/:applicationId', protect, getPaymentByApplication);

module.exports = router;
