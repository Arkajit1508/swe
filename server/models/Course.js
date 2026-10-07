const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: [true, 'Please provide program name'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please provide department name'],
      trim: true
    },
    degree: {
      type: String,
      required: true,
      enum: ['B.Tech', 'BCA', 'BBA', 'M.Tech', 'MCA', 'MBA'],
      default: 'B.Tech'
    },
    durationYears: {
      type: Number,
      default: 4
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 60
    },
    availableSeats: {
      type: Number,
      required: true,
      default: 60
    },
    applicationFee: {
      type: Number,
      default: 500
    },
    eligibility: {
      type: String,
      default: 'Minimum 60% aggregate in 10+2 with Physics, Chemistry & Mathematics'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
