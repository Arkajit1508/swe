const express = require('express');
const router = express.Router();
const { getMyExam, createOrUpdateExam, getAllExams } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/me', protect, getMyExam);
router.get('/', protect, authorize('admin'), getAllExams);
router.post('/', protect, authorize('admin'), createOrUpdateExam);

module.exports = router;
