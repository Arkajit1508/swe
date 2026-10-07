const Payment = require('../models/Payment');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// @desc   Execute mock payment for application fee
// @route  POST /api/payments/mock
// @access Private (Student)
exports.processMockPayment = async (req, res) => {
  try {
    const { applicationId, amount = 500, paymentMethod = 'DEMO_GATEWAY' } = req.body;

    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'Application ID is required' });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    if (application.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, message: 'Application fee has already been paid' });
    }

    // Generate clean mock transaction ID: TXN-IEM-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `TXN-IEM-${dateStr}-${randomHex}`;

    // Create payment entry
    const payment = await Payment.create({
      applicationId: application._id,
      applicantId: req.user._id,
      amount,
      paymentStatus: 'SUCCESS',
      transactionId,
      paymentMethod,
      paymentDate: new Date()
    });

    // Update application paymentStatus
    application.paymentStatus = 'PAID';
    await application.save();

    // Create confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Received',
      message: `Your application fee of ₹${amount} was received successfully. (Txn ID: ${transactionId})`,
      type: 'SUCCESS'
    });

    res.status(200).json({
      success: true,
      message: 'Demo payment completed successfully',
      payment,
      application
    });
  } catch (error) {
    console.error('Mock Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
};

// @desc   Get payment receipt details for an application
// @route  GET /api/payments/:applicationId
// @access Private
exports.getPaymentByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const payment = await Payment.findOne({ applicationId })
      .populate('applicantId', 'name email phone');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'No payment record found for this application' });
    }

    // Role check: Only owner or admin
    if (req.user.role !== 'admin' && payment.applicantId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this payment' });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve payment details' });
  }
};
