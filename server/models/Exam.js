const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    examName: {
      type: String,
      default: 'IEMJEE 2026'
    },
    examDate: {
      type: Date
    },
    examVenue: {
      type: String,
      default: 'IEM Kolkata Campus / Online Proctored'
    },
    examStatus: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'ABSENT', 'CANCELLED'],
      default: 'SCHEDULED'
    },
    score: {
      type: Number
    },
    rank: {
      type: Number
    },
    admitCardNumber: {
      type: String
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

module.exports = mongoose.model('Exam', examSchema);
