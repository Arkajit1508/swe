const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicationNumber: {
      type: String,
      unique: true,
      required: true
    },

    // SECTION 1: Personal Information
    personalInfo: {
      fullName: { type: String, default: '' },
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ['', 'Male', 'Female', 'Other'], default: '' },
      category: { type: String, enum: ['', 'General', 'OBC', 'SC', 'ST', 'EWS'], default: '' },
      nationality: { type: String, default: 'Indian' },
      bloodGroup: { type: String, default: '' },
      guardianName: { type: String, default: '' },
      guardianPhone: { type: String, default: '' }
    },

    // SECTION 2: Contact Information
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      addressLine: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pinCode: { type: String, default: '' }
    },

    // SECTION 3: Academic Information
    academicInfo: {
      tenthBoard: { type: String, default: '' },
      tenthSchool: { type: String, default: '' },
      tenthYear: {
        type: Number,
        min: [2018, 'Class 10 passing year cannot be earlier than 2018'],
        max: [2026, 'Class 10 passing year cannot be in the future (max: 2026)'],
        validate: {
          validator: function (v) { return v == null || Number.isInteger(v); },
          message: '{VALUE} must be an integer year'
        }
      },
      tenthPercentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      },
      twelfthBoard: { type: String, default: '' },
      twelfthSchool: { type: String, default: '' },
      twelfthYear: {
        type: Number,
        min: [2018, 'Class 12 passing year cannot be earlier than 2018'],
        max: [2026, 'Class 12 passing year cannot be in the future (max: 2026)'],
        validate: {
          validator: function (v) { return v == null || Number.isInteger(v); },
          message: '{VALUE} must be an integer year'
        }
      },
      twelfthPercentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
      },
      stream: { type: String, default: '' }
    },

    // SECTION 4: Course Selection
    courseSelection: {
      department: { type: String, default: '' },
      program: { type: String, default: '' },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    },

    // SECTION 5: Entrance Exam Info
    examInfo: {
      examName: { type: String, default: 'IEMJEE' },
      rollNumber: { type: String, default: '' },
      rankOrScore: {
        type: Number,
        min: [1, 'Rank must be a positive integer (min: 1)'],
        validate: {
          validator: function (v) { return v == null || Number.isInteger(v); },
          message: '{VALUE} must be an integer rank or score'
        }
      }
    },

    // Application Status Flow
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'DOCUMENT_VERIFICATION',
        'APPROVED',
        'REJECTED',
        'COUNSELLING',
        'ALLOCATED'
      ],
      default: 'DRAFT'
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING'
    },

    rejectionReason: {
      type: String,
      default: ''
    },

    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Application', applicationSchema);
