const Course = require('../models/Course');

// @desc   Get all active courses/programs
// @route  GET /api/courses
// @access Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ department: 1, programName: 1 });
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

// @desc   Get single course details
// @route  GET /api/courses/:id
// @access Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch course details' });
  }
};

// @desc   Create course (Admin)
// @route  POST /api/admin/courses
// @access Private (Admin)
exports.createCourse = async (req, res) => {
  try {
    const { programName, department, degree, durationYears, totalSeats, applicationFee, eligibility } = req.body;

    if (!programName || !department || !totalSeats) {
      return res.status(400).json({ success: false, message: 'Please provide all required course fields' });
    }

    const course = await Course.create({
      programName,
      department,
      degree: degree || 'B.Tech',
      durationYears: durationYears || 4,
      totalSeats,
      availableSeats: totalSeats,
      applicationFee: applicationFee || 500,
      eligibility: eligibility || 'Minimum 60% aggregate in 10+2 with PCM'
    });

    res.status(201).json({
      success: true,
      message: 'Course added successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
};

// @desc   Update course (Admin)
// @route  PUT /api/admin/courses/:id
// @access Private (Admin)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};
