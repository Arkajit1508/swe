const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);

module.exports = router;
