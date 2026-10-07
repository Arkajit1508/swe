const Application = require('../models/Application');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Document = require('../models/Document');

// @desc   Get aggregated admin dashboard metrics using MongoDB Aggregation Pipeline
// @route  GET /api/admin/dashboard
// @access Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total counts
    const totalApplications = await Application.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isActive: true });

    // 2. Applications Grouped by Status (MongoDB Aggregation $group)
    const statusDistribution = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format status map for fast access
    const statusMap = {
      DRAFT: 0,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      DOCUMENT_VERIFICATION: 0,
      APPROVED: 0,
      REJECTED: 0,
      COUNSELLING: 0,
      ALLOCATED: 0
    };

    statusDistribution.forEach(item => {
      if (item._id) statusMap[item._id] = item.count;
    });

    const pendingCount = (statusMap.SUBMITTED || 0) + (statusMap.UNDER_REVIEW || 0) + (statusMap.DOCUMENT_VERIFICATION || 0);
    const approvedCount = (statusMap.APPROVED || 0) + (statusMap.COUNSELLING || 0) + (statusMap.ALLOCATED || 0);
    const rejectedCount = statusMap.REJECTED || 0;

    // 3. Applications Grouped by Department (MongoDB Aggregation $group & $sort)
    const departmentDistribution = await Application.aggregate([
      {
        $match: {
          'courseSelection.department': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$courseSelection.department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 4. Applications Grouped by Program (Degree level)
    const programDistribution = await Application.aggregate([
      {
        $match: {
          'courseSelection.program': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$courseSelection.program',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 5. Total Revenue from Mock Application Payments (Aggregation $match + $group)
    const paymentAggregation = await Payment.aggregate([
      {
        $match: { paymentStatus: 'SUCCESS' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = paymentAggregation.length > 0 ? paymentAggregation[0].totalRevenue : 0;
    const totalTransactions = paymentAggregation.length > 0 ? paymentAggregation[0].totalTransactions : 0;

    // 6. Recent 5 applications
    const recentApplications = await Application.find()
      .populate('applicant', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalApplications,
          pendingApplications: pendingCount,
          approvedApplications: approvedCount,
          rejectedApplications: rejectedCount,
          totalStudents,
          totalCourses,
          totalRevenue,
          totalTransactions
        },
        statusDistribution: statusMap,
        departmentDistribution,
        programDistribution,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Aggregation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to aggregate dashboard metrics' });
  }
};

// @desc   Get applications with search, status filter, and pagination
// @route  GET /api/admin/applications
// @access Private (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { search, status, department, program, page = 1, limit = 20 } = req.query;

    const query = {};

    // Filter by status if provided
    if (status && status !== 'ALL') {
      query.status = status;
    }

    // Filter by department
    if (department && department !== 'ALL') {
      query['courseSelection.department'] = department;
    }

    // Filter by program
    if (program && program !== 'ALL') {
      query['courseSelection.program'] = program;
    }

    // Text search query
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }]
      }).select('_id');

      const userIds = matchingUsers.map(u => u._id);

      query.$or = [
        { applicationNumber: searchRegex },
        { 'personalInfo.fullName': searchRegex },
        { 'contactInfo.email': searchRegex },
        { applicant: { $in: userIds } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('applicant', 'name email phone')
      .populate('courseSelection.courseId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      applications
    });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications list' });
  }
};
