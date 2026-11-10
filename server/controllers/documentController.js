
const Document = require('../models/Document');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { supabase, bucketName } = require('../config/supabase');
const path = require('path');
const crypto = require('crypto');

// Check actual file signature, not just the supplied MIME type.
const validateFileContent = (buffer, mimeType) => {
  if (mimeType === 'application/pdf') {
    return buffer.subarray(0, 5).toString() === '%PDF-';
  }

  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xFF &&
      buffer[1] === 0xD8 &&
      buffer[2] === 0xFF;
  }

  if (mimeType === 'image/png') {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    );
  }

  return false;
};

// Delete a file from Supabase Storage.
const deleteStoredFile = async (filePath) => {
  if (!filePath || filePath.startsWith('/uploads/')) {
    return;
  }

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error('Supabase file deletion error:', error.message);
  }
};

// @desc   Upload document for an application
// @route  POST /api/documents/upload
// @access Private (Student)
exports.uploadDocument = async (req, res) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload'
      });
    }

    const { applicationId, documentType } = req.body;

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and Document Type are required'
      });
    }

    // Validate actual file contents.
    if (!validateFileContent(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'File content does not match its file type'
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized'
      });
    }

    const existingDoc = await Document.findOne({
      applicationId: application._id,
      documentType
    });

    // Generate a unique storage path.
    const ext = path.extname(req.file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

    const storagePath = `${application._id}/${uniqueName}`;

    // Upload the actual file to private Supabase Storage.
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to upload document to storage'
      });
    }

    uploadedFilePath = storagePath;

    if (existingDoc) {
      const oldFilePath = existingDoc.filePath;

      existingDoc.originalFileName = req.file.originalname;
      existingDoc.storedFileName = storagePath;
      existingDoc.filePath = storagePath;
      existingDoc.mimeType = req.file.mimetype;
      existingDoc.fileSize = req.file.size;
      existingDoc.verificationStatus = 'PENDING';
      existingDoc.remarks = '';
      existingDoc.uploadedAt = new Date();

      await existingDoc.save();

      // Delete the old file only after the database update succeeds.
      await deleteStoredFile(oldFilePath);

      return res.status(200).json({
        success: true,
        message: 'Document replaced successfully',
        document: existingDoc
      });
    }

    const newDoc = await Document.create({
      applicationId: application._id,
      applicantId: req.user._id,
      documentType,
      originalFileName: req.file.originalname,
      storedFileName: storagePath,
      filePath: storagePath,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      verificationStatus: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: newDoc
    });

  } catch (error) {
    // Clean up the newly uploaded file if database saving fails.
    if (uploadedFilePath) {
      await deleteStoredFile(uploadedFilePath);
    }

    console.error('Document Upload Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error uploading document'
    });
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
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      application.applicant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const documents = await Document.find({ applicationId });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });

  } catch (error) {
    console.error('Fetch documents error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
};

// @desc   Generate a temporary private document URL
// @route  GET /api/documents/:id/url
// @access Private (Owner Student or Admin)
exports.getDocumentUrl = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      document.applicantId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(document.filePath, 60);

    if (error) {
      console.error('Signed URL error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Unable to generate document viewing link'
      });
    }

    return res.status(200).json({
      success: true,
      url: data.signedUrl
    });

  } catch (error) {
    console.error('Document URL error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate document URL'
    });
  }
};

// @desc   Delete a document
// @route  DELETE /api/documents/:id
// @access Private (Owner Student or Admin)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (
      document.applicantId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this document'
      });
    }

    await deleteStoredFile(document.filePath);

    await Document.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Document deletion error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

// @desc   Admin verifies or rejects a document
// @route  PUT /api/admin/documents/:id/verify
// @access Private (Admin)
exports.verifyDocument = async (req, res) => {
  try {
    const { verificationStatus, remarks } = req.body;

    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.verificationStatus = verificationStatus;
    document.remarks = remarks || '';

    await document.save();

    // Create student notification.
    await Notification.create({
      userId: document.applicantId,
      title: `Document ${verificationStatus}: ${document.documentType}`,
      message: `Your uploaded '${document.documentType}' has been marked as ${verificationStatus}.${remarks ? ' Remark: ' + remarks : ''}`,
      type: verificationStatus === 'VERIFIED' ? 'SUCCESS' : 'WARNING'
    });

    return res.status(200).json({
      success: true,
      message: `Document status updated to '${verificationStatus}'`,
      document
    });

  } catch (error) {
    console.error('Document verification error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update document status'
    });
  }
};
