const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getApplicationDocuments,
  deleteDocument,
  verifyDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/application/:applicationId', protect, getApplicationDocuments);
router.delete('/:id', protect, deleteDocument);
router.put('/:id/verify', protect, authorize('admin'), verifyDocument);

module.exports = router;
