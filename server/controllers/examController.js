const Exam = require('../models/Exam');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// @desc   Get current student's exam details
// @route  GET /api/exams/me
// @access Private (Student)
exports.getMyExam = async (req, res) => {
  try {
    let exam = await Exam.findOne({ applicantId: req.user._id })
      .populate('applicationId', 'applicationNumber status');

    if (!exam) {
      // Find student application
      const app = await Application.findOne({ applicant: req.user._id });
      // Generate default scheduled exam if application exists
      if (app) {
        const examDate = new Date();
        examDate.setDate(examDate.getDate() + 14); // 2 weeks from now
        exam = await Exam.create({
          applicationId: app._id,
          applicantId: req.user._id,
          examName: 'IEMJEE 2026 Phase-1',
          examDate,
          examVenue: 'IEM Salt Lake Campus / Online Proctored Portal',
          examStatus: 'SCHEDULED',
          admitCardNumber: `IEMJEE-2026-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }
    }

    res.status(200).json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exam details' });
  }
};

// @desc   Admin updates or schedules exam for applicant
// @route  POST /api/admin/exams
// @access Private (Admin)
exports.createOrUpdateExam = async (req, res) => {
  try {
    const { applicationId, applicantId, examName, examDate, examVenue, examStatus, score, rank, remarks } = req.body;

    let exam = await Exam.findOne({
      $or: [{ applicationId }, { applicantId }]
    });

    if (exam) {
      if (examName) exam.examName = examName;
      if (examDate) exam.examDate = new Date(examDate);
      if (examVenue) exam.examVenue = examVenue;
      if (examStatus) exam.examStatus = examStatus;
      if (score !== undefined) exam.score = score;
      if (rank !== undefined) exam.rank = rank;
      if (remarks) exam.remarks = remarks;
      await exam.save();
    } else {
      exam = await Exam.create({
        applicationId,
        applicantId,
        examName: examName || 'IEMJEE 2026',
        examDate: examDate ? new Date(examDate) : new Date(),
        examVenue: examVenue || 'IEM Kolkata Salt Lake Campus',
        examStatus: examStatus || 'SCHEDULED',
        score,
        rank,
        admitCardNumber: `IEMJEE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        remarks
      });
    }

    // Send notification
    await Notification.create({
      userId: applicantId,
      title: 'Entrance Exam Update',
      message: `Your entrance exam (${exam.examName}) details have been updated. Status: ${exam.examStatus}${rank ? ` | Rank: ${rank}` : ''}`,
      type: 'INFO'
    });

    res.status(200).json({
      success: true,
      message: 'Exam details saved successfully',
      exam
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update exam' });
  }
};

// @desc   Get all exams (Admin)
// @route  GET /api/admin/exams
// @access Private (Admin)
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('applicantId', 'name email phone')
      .populate('applicationId', 'applicationNumber status courseSelection')
      .sort({ examDate: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exams list' });
  }
};
