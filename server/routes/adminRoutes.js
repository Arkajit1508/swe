
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
  allocateSeat,
  getAllAllocations
} = require('../controllers/counsellingController');

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

// Counselling & Seat Allocation
router.get('/counselling/all', getAllAllocations);
router.post('/counselling/allocate', allocateSeat);

module.exports = router;
