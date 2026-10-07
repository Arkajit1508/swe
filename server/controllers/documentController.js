const Document = require('../models/Document');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const fs = require('fs');
const path = require('path');

// @desc   Upload document for an application
// @route  POST /api/documents/upload
// @access Private (Student)
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const { applicationId, documentType } = req.body;

    if (!applicationId || !documentType) {
      // Clean up uploaded file if missing body fields
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Application ID and Document Type are required' });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: req.user._id
    });

    if (!application) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    // Check if a document of this type already exists for this application
    const existingDoc = await Document.findOne({
      applicationId: application._id,
      documentType
    });

    if (existingDoc) {
      // Remove old file from disk
      const oldFilePath = path.join(__dirname, '../uploads', existingDoc.storedFileName);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (e) {
          console.error('Error unlinking old file:', e);
        }
      }

      // Update existing record
      existingDoc.originalFileName = req.file.originalname;
      existingDoc.storedFileName = req.file.filename;
      existingDoc.filePath = `/uploads/${req.file.filename}`;
      existingDoc.mimeType = req.file.mimetype;
      existingDoc.fileSize = req.file.size;
      existingDoc.verificationStatus = 'PENDING';
      existingDoc.remarks = '';
      existingDoc.uploadedAt = new Date();

      await existingDoc.save();

      return res.status(200).json({
        success: true,
        message: 'Document replaced successfully',
        document: existingDoc
      });
    }

    // Create new document record in MongoDB
    const newDoc = await Document.create({
      applicationId: application._id,
      applicantId: req.user._id,
      documentType,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      verificationStatus: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: newDoc
    });
  } catch (error) {
    console.error('Document Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error uploading document' });
  }
};

// @desc   Get all documents for an application
// @route  GET /api/documents/application/:applicationId
// @access Private (Owner Student or Admin)
exports.getApplicationDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (req.user.role !== 'admin' && application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const documents = await Document.find({ applicationId });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};

// @desc   Delete a document
// @route  DELETE /api/documents/:id
// @access Private (Student)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.applicantId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this document' });
    }

    // Remove file from disk
    const diskPath = path.join(__dirname, '../uploads', document.storedFileName);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (e) {
        console.error('Error deleting file from disk:', e);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};

// @desc   Admin verifies or rejects a document
// @route  PUT /api/admin/documents/:id/verify
// @access Private (Admin)
exports.verifyDocument = async (req, res) => {
  try {
    const { verificationStatus, remarks } = req.body;

    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.verificationStatus = verificationStatus;
    document.remarks = remarks || '';
    await document.save();

    // Create student notification
    await Notification.create({
      userId: document.applicantId,
      title: `Document ${verificationStatus}: ${document.documentType}`,
      message: `Your uploaded '${document.documentType}' has been marked as ${verificationStatus}.${remarks ? ' Remark: ' + remarks : ''}`,
      type: verificationStatus === 'VERIFIED' ? 'SUCCESS' : 'WARNING'
    });

    res.status(200).json({
      success: true,
      message: `Document status updated to '${verificationStatus}'`,
      document
    });
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to update document status' });
  }
};
