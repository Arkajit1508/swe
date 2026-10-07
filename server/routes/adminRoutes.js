const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllApplications } = require('../controllers/adminController');
const { getApplicationById, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes are protected and role-restricted
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;
