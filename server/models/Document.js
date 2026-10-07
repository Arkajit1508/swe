const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        '10th_Marksheet',
        '12th_Marksheet',
        'ID_Proof',
        'Photograph',
        'Signature',
        'Entrance_Rank_Card',
        'Other'
      ]
    },
    originalFileName: {
      type: String,
      required: true
    },
    storedFileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', documentSchema);
