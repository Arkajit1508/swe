const Application = require('../models/Application');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Allowed status transition state machine matrix
const ALLOWED_TRANSITIONS = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['DOCUMENT_VERIFICATION', 'REJECTED'],
  DOCUMENT_VERIFICATION: ['APPROVED', 'REJECTED'],
  APPROVED: ['COUNSELLING'],
  COUNSELLING: ['ALLOCATED', 'REJECTED'],
  ALLOCATED: [],
  REJECTED: ['UNDER_REVIEW'] // Can be re-reviewed if student resolves issues
};

// Helper to generate application number: IEM-YEAR-RANDOM
const generateAppNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IEM-${year}-${randomNum}`;
};

// @desc   Get current logged-in student's application
// @route  GET /api/applications/me
// @access Private (Student)
exports.getMyApplication = async (req, res) => {
  try {
    let application = await Application.findOne({ applicant: req.user._id })
      .populate('courseSelection.courseId')
      .populate('applicant', 'name email phone dateOfBirth');

    if (!application) {
      // Auto initialize a clean DRAFT application for new students with registered profile details
      application = await Application.create({
        applicant: req.user._id,
        applicationNumber: generateAppNumber(),
        personalInfo: {
          fullName: req.user.name || '',
          dateOfBirth: req.user.dateOfBirth || undefined,
          nationality: 'Indian'
        },
        contactInfo: {
          email: req.user.email || '',
          phone: req.user.phone || ''
        },
        status: 'DRAFT',
        paymentStatus: 'PENDING'
      });
    } else if (req.user.dateOfBirth && (!application.personalInfo || !application.personalInfo.dateOfBirth)) {
      // Auto transfer registered dateOfBirth into existing draft application
      application.personalInfo = application.personalInfo || {};
      application.personalInfo.dateOfBirth = req.user.dateOfBirth;
      await application.save();
    }

    const documents = await Document.find({ applicationId: application._id });
    const payment = await Payment.findOne({ applicationId: application._id });

    res.status(200).json({
      success: true,
      application,
      documents,
      payment
    });
  } catch (error) {
    console.error('Error fetching student application:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application' });
  }
};

// @desc   Save or update draft application
// @route  POST /api/applications/draft or PUT /api/applications/:id
// @access Private (Student)
exports.saveDraft = async (req, res) => {
  try {
    const { personalInfo, contactInfo, academicInfo, courseSelection, examInfo } = req.body;

    let application = await Application.findOne({ applicant: req.user._id });

    if (!application) {
      application = new Application({
        applicant: req.user._id,
        applicationNumber: generateAppNumber(),
        status: 'DRAFT'
      });
    }

    // Only allow editing if in DRAFT or REJECTED state
    if (application.status !== 'DRAFT' && application.status !== 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: `Cannot edit application while in '${application.status}' status`
      });
    }

    if (personalInfo) {
      if (personalInfo.guardianPhone) {
        personalInfo.guardianPhone = String(personalInfo.guardianPhone).replace(/\D/g, '').slice(0, 10);
      }
      application.personalInfo = { ...application.personalInfo, ...personalInfo };
    }
    if (contactInfo) {
      if (contactInfo.phone) {
        contactInfo.phone = String(contactInfo.phone).replace(/\D/g, '').slice(0, 10);
      }
      if (contactInfo.pinCode) {
        contactInfo.pinCode = String(contactInfo.pinCode).replace(/\D/g, '').slice(0, 6);
      }
      application.contactInfo = { ...application.contactInfo, ...contactInfo };
    }
    if (academicInfo) {
      if (academicInfo.tenthYear !== undefined && academicInfo.tenthYear !== '') {
        academicInfo.tenthYear = Math.max(2018, Math.min(2024, Math.round(Number(academicInfo.tenthYear))));
      }
      if (academicInfo.twelfthYear !== undefined && academicInfo.twelfthYear !== '') {
        academicInfo.twelfthYear = Math.max(2018, Math.min(2026, Math.round(Number(academicInfo.twelfthYear))));
      }
      if (academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '') {
        const p10 = Number(academicInfo.tenthPercentage);
        if (!isNaN(p10) && (p10 < 0 || p10 > 100)) {
          return res.status(400).json({
            success: false,
            message: `Class 10 percentage cannot exceed 100% and must be between 0% and 100% (received: ${academicInfo.tenthPercentage}%)`
          });
        }
      }
      if (academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '') {
        const p12 = Number(academicInfo.twelfthPercentage);
        if (!isNaN(p12) && (p12 < 0 || p12 > 100)) {
          return res.status(400).json({
            success: false,
            message: `Class 12 percentage cannot exceed 100% and must be between 0% and 100% (received: ${academicInfo.twelfthPercentage}%)`
          });
        }
      }
      application.academicInfo = { ...application.academicInfo, ...academicInfo };
    }
    if (courseSelection) application.courseSelection = { ...application.courseSelection, ...courseSelection };
    if (examInfo) {
      if (examInfo.rankOrScore !== undefined && examInfo.rankOrScore !== '') {
        examInfo.rankOrScore = Math.max(1, Math.round(Number(examInfo.rankOrScore)));
      }
      application.examInfo = { ...application.examInfo, ...examInfo };
    }

    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application draft saved successfully',
      application
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ success: false, message: 'Failed to save application draft' });
  }
};

// @desc   Submit application (Transitions DRAFT -> SUBMITTED)
// @route  POST /api/applications/:id/submit
// @access Private (Student)
exports.submitApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicant: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'DRAFT' && application.status !== 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: `Application is already in '${application.status}' state`
      });
    }

    // Server-side validation of mandatory fields before submission
    const { personalInfo, contactInfo, academicInfo, courseSelection } = application;
    
    if (!personalInfo?.fullName || !personalInfo?.dateOfBirth || !personalInfo?.gender) {
      return res.status(400).json({ success: false, message: 'Please complete all required Personal Information fields' });
    }

    if (/\d/.test(personalInfo.fullName)) {
      return res.status(400).json({ success: false, message: 'Candidate Name cannot contain numbers. Only letters and spaces are allowed.' });
    }

    if (personalInfo.guardianName && /\d/.test(personalInfo.guardianName)) {
      return res.status(400).json({ success: false, message: 'Parent / Guardian Name cannot contain numbers. Only letters and spaces are allowed.' });
    }

    if (personalInfo.guardianPhone && personalInfo.guardianPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Guardian Contact Number must be a valid 10-digit mobile number.' });
    }

    if (!contactInfo?.addressLine || !contactInfo?.city || !contactInfo?.state || !contactInfo?.pinCode) {
      return res.status(400).json({ success: false, message: 'Please complete all required Contact Information fields' });
    }

    if (!contactInfo.phone || contactInfo.phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Candidate Mobile Number must be a valid 10-digit mobile number.' });
    }

    if (!contactInfo.pinCode || contactInfo.pinCode.length !== 6) {
      return res.status(400).json({ success: false, message: 'PIN Code must be a valid 6-digit postal code.' });
    }

    if (!academicInfo?.tenthPercentage || !academicInfo?.twelfthPercentage) {
      return res.status(400).json({ success: false, message: 'Please complete your 10th and 12th Academic Details' });
    }

    if (!courseSelection?.program || !courseSelection?.department) {
      return res.status(400).json({ success: false, message: 'Please select your desired Program and Department' });
    }

    // Check payment status
    if (application.paymentStatus !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Application fee must be paid before final submission'
      });
    }

    // Transition status to SUBMITTED
    application.status = 'SUBMITTED';
    application.submittedAt = new Date();
    await application.save();

    // Create Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `Your IEM application (${application.applicationNumber}) has been submitted successfully and is queued for review.`,
      type: 'SUCCESS'
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Server error during submission' });
  }
};

// @desc   Get single application details (Student owner or Admin)
// @route  GET /api/applications/:id
// @access Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone dateOfBirth')
      .populate('courseSelection.courseId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role check: Admin can access any, Student can only access own
    if (req.user.role !== 'admin' && application.applicant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this application' });
    }

    const documents = await Document.find({ applicationId: application._id });
    const payment = await Payment.findOne({ applicationId: application._id });

    res.status(200).json({
      success: true,
      application,
      documents,
      payment
    });
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application details' });
  }
};

// @desc   Admin updates application status with state-machine validation
// @route  PUT /api/admin/applications/:id/status
// @access Private (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const currentStatus = application.status;
    const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];

    // Check if the requested status transition is valid
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition. Cannot move from '${currentStatus}' to '${status}'. Allowed transitions: [${allowedNext.join(', ')}]`
      });
    }

    application.status = status;
    if (status === 'REJECTED') {
      application.rejectionReason = rejectionReason || 'Requirements or documents not verified.';
    } else {
      application.rejectionReason = '';
    }

    await application.save();

    // Notify the student
    let notifMsg = `Your application status has been updated to: ${status}.`;
    let notifType = 'INFO';
    if (status === 'APPROVED') {
      notifMsg = 'Congratulations! Your application for IEM has been APPROVED.';
      notifType = 'SUCCESS';
    } else if (status === 'REJECTED') {
      notifMsg = `Your application has been REJECTED. Reason: ${application.rejectionReason}`;
      notifType = 'WARNING';
    } else if (status === 'DOCUMENT_VERIFICATION') {
      notifMsg = 'Your documents are currently under verification by the admissions committee.';
      notifType = 'ACTION_REQUIRED';
    }

    await Notification.create({
      userId: application.applicant,
      title: `Application Status: ${status}`,
      message: notifMsg,
      type: notifType
    });

    res.status(200).json({
      success: true,
      message: `Status updated to '${status}' successfully`,
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status' });
  }
};

// @desc   Track application status publicly by application number
// @route  GET /api/applications/track/:appNumber
// @access Public
exports.getApplicationByAppNumber = async (req, res) => {
  try {
    const { appNumber } = req.params;
    const application = await Application.findOne({ applicationNumber: appNumber.toUpperCase() })
      .populate('applicant', 'name email phone');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application reference not found' });
    }

    res.status(200).json({
      success: true,
      application: {
        applicationNumber: application.applicationNumber,
        status: application.status,
        program: `${application.courseSelection?.program || 'B.Tech'} - ${application.courseSelection?.department || 'Computer Science'}`,
        applicantName: application.personalInfo?.fullName || application.applicant?.name,
        submittedAt: application.submittedAt || application.createdAt
      }
    });
  } catch (error) {
    console.error('Error tracking application:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application tracking details' });
  }
};
