
const express = require('express');
const router = express.Router();

const {
  uploadDocument,
  getApplicationDocuments,
  getDocumentUrl,
  deleteDocument,
  verifyDocument
} = require('../controllers/documentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Upload a document
router.post('/upload', protect, upload.single('file'), uploadDocument);

// Get documents belonging to an application
router.get('/application/:applicationId', protect, getApplicationDocuments);

// Generate a temporary private viewing URL
router.get('/:id/url', protect, getDocumentUrl);

// Delete a document
router.delete('/:id', protect, deleteDocument);

// Admin document verification
router.put('/:id/verify', protect, authorize('admin'), verifyDocument);

module.exports = router;
