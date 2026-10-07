const mongoose = require('mongoose');

const seatAllocationSchema = new mongoose.Schema(
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
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    round: {
      type: Number,
      default: 1
    },
    seatStatus: {
      type: String,
      enum: ['PROVISIONALLY_ALLOCATED', 'CONFIRMED', 'CANCELLED'],
      default: 'PROVISIONALLY_ALLOCATED'
    },
    allocationDate: {
      type: Date,
      default: Date.now
    },
    reportingDeadline: {
      type: Date
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

module.exports = mongoose.model('SeatAllocation', seatAllocationSchema);
