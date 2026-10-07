const SeatAllocation = require('../models/SeatAllocation');
const Application = require('../models/Application');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc   Get current student's counselling & seat allocation status
// @route  GET /api/counselling/me
// @access Private (Student)
exports.getMyAllocation = async (req, res) => {
  try {
    const allocation = await SeatAllocation.findOne({ applicantId: req.user._id })
      .populate('courseId')
      .populate('applicationId', 'applicationNumber status personalInfo');

    res.status(200).json({
      success: true,
      allocation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch allocation details' });
  }
};

// @desc   Admin allocates a seat to an applicant
// @route  POST /api/admin/counselling/allocate
// @access Private (Admin)
exports.allocateSeat = async (req, res) => {
  try {
    const { applicationId, courseId, round = 1, seatStatus = 'PROVISIONALLY_ALLOCATED', remarks } = req.body;

    if (!applicationId || !courseId) {
      return res.status(400).json({ success: false, message: 'Application ID and Course ID are required' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let allocation = await SeatAllocation.findOne({ applicationId });

    if (allocation) {
      allocation.courseId = courseId;
      allocation.round = round;
      allocation.seatStatus = seatStatus;
      allocation.remarks = remarks || '';
      allocation.allocationDate = new Date();
      await allocation.save();
    } else {
      allocation = await SeatAllocation.create({
        applicationId: application._id,
        applicantId: application.applicant,
        courseId: course._id,
        round,
        seatStatus,
        remarks: remarks || '',
        reportingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });

      // Decrement available course seats if > 0
      if (course.availableSeats > 0) {
        course.availableSeats -= 1;
        await course.save();
      }
    }

    // Update application status to ALLOCATED
    application.status = 'ALLOCATED';
    await application.save();

    // Notify student
    await Notification.create({
      userId: application.applicant,
      title: 'Seat Allocation Letter Issued',
      message: `Congratulations! You have been allocated a seat in '${course.programName}' under Round ${round}.`,
      type: 'SUCCESS'
    });

    res.status(200).json({
      success: true,
      message: 'Seat allocated successfully',
      allocation
    });
  } catch (error) {
    console.error('Seat allocation error:', error);
    res.status(500).json({ success: false, message: 'Failed to allocate seat' });
  }
};

// @desc   Get all seat allocations (Admin)
// @route  GET /api/admin/counselling/all
// @access Private (Admin)
exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await SeatAllocation.find()
      .populate('applicantId', 'name email phone')
      .populate('courseId')
      .populate('applicationId', 'applicationNumber status personalInfo')
      .sort({ allocationDate: -1 });

    res.status(200).json({
      success: true,
      count: allocations.length,
      allocations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch allocations' });
  }
};
