
const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getAllApplications
} = require('../controllers/adminController');

const {
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applicationController');

const {
  verifyDocument
} = require('../controllers/documentController');

const {
  getAllExams,
  createOrUpdateExam
} = require('../controllers/examController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes below require admin authentication
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Applications
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.put('/applications/:id/status', updateApplicationStatus);

// Documents
router.put('/documents/:id/verify', verifyDocument);

// Exams
router.get('/exams', getAllExams);
router.post('/exams', createOrUpdateExam);

module.exports = router;
