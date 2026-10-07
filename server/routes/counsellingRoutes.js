const express = require('express');
const router = express.Router();
const { getMyAllocation, allocateSeat, getAllAllocations } = require('../controllers/counsellingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/me', protect, getMyAllocation);
router.get('/all', protect, authorize('admin'), getAllAllocations);
router.post('/allocate', protect, authorize('admin'), allocateSeat);

module.exports = router;
