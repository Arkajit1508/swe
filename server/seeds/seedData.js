const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Application = require('../models/Application');
const Document = require('../models/Document');
const Payment = require('../models/Payment');
const Exam = require('../models/Exam');
const SeatAllocation = require('../models/SeatAllocation');
const Notification = require('../models/Notification');

const sampleCourses = [
  {
    programName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 180,
    availableSeats: 142,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Information Technology',
    department: 'Information Technology',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 98,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Electronics & Communication Engineering',
    department: 'Electronics & Communication',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 85,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Computer Science & Business Systems',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 60,
    availableSeats: 45,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate'
  },
  {
    programName: 'Bachelor of Computer Applications (BCA)',
    department: 'Computer Applications',
    degree: 'BCA',
    durationYears: 3,
    totalSeats: 120,
    availableSeats: 90,
    applicationFee: 500,
    eligibility: '10+2 in any stream with Mathematics/Computer Science (min 50%)'
  },
  {
    programName: 'Master of Computer Applications (MCA)',
    department: 'Computer Applications',
    degree: 'MCA',
    durationYears: 2,
    totalSeats: 60,
    availableSeats: 35,
    applicationFee: 500,
    eligibility: 'BCA/B.Sc Computer Science with min 50% + JECA rank'
  },
  {
    programName: 'Master of Business Administration (MBA)',
    department: 'Management Studies',
    degree: 'MBA',
    durationYears: 2,
    totalSeats: 120,
    availableSeats: 70,
    applicationFee: 500,
    eligibility: 'Graduation in any discipline with min 50% + CAT/MAT/JEMAT score'
  }
];

const seedDB = async (customUri) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = typeof customUri === 'string' ? customUri : (process.env.MONGO_URI || 'mongodb://localhost:27017/iem_admission_db');
      await mongoose.connect(mongoUri);
      console.log(`Connected to MongoDB for Seeding at ${mongoUri}`);
    }

    // Clean existing database records
    await User.deleteMany({});
    await Course.deleteMany({});
    await Application.deleteMany({});
    await Document.deleteMany({});
    await Payment.deleteMany({});
    await Exam.deleteMany({});
    await SeatAllocation.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Courses
    const createdCourses = await Course.insertMany(sampleCourses);
    console.log(`Seeded ${createdCourses.length} Courses.`);

    // 2. Create Password Hash
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const studentPassword = await bcrypt.hash('Student@123', salt);

    // 3. Create Admin Account
    const adminUser = await User.create({
      name: 'IEM Admissions Dean',
      email: 'admin@iem.edu',
      password: adminPassword,
      phone: '9876543210',
      role: 'admin'
    });
    console.log('Created Admin User: admin@iem.edu / Admin@123');

    // 4. Create Sample Students
    const student1 = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      password: studentPassword,
      phone: '9830112233',
      dateOfBirth: new Date('2005-04-15'),
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Ananya Sen',
      email: 'ananya.sen@example.com',
      password: studentPassword,
      phone: '9830223344',
      dateOfBirth: new Date('2005-08-20'),
      role: 'student'
    });

    const student3 = await User.create({
      name: 'Arjun Mukherjee',
      email: 'arjun.m@example.com',
      password: studentPassword,
      phone: '9830334455',
      dateOfBirth: new Date('2004-12-10'),
      role: 'student'
    });

    const student4 = await User.create({
      name: 'Pooja Das',
      email: 'pooja.das@example.com',
      password: studentPassword,
      phone: '9830445566',
      dateOfBirth: new Date('2005-02-28'),
      role: 'student'
    });

    const student5 = await User.create({
      name: 'Vikram Ghosh',
      email: 'vikram.g@example.com',
      password: studentPassword,
      phone: '9830556677',
      dateOfBirth: new Date('2005-11-05'),
      role: 'student'
    });

    console.log('Created 5 Student Accounts (Password: Student@123)');

    // Create a dummy file in uploads so document links work
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const sampleDocPath = path.join(uploadsDir, 'sample_marksheet.pdf');
    if (!fs.existsSync(sampleDocPath)) {
      fs.writeFileSync(sampleDocPath, '%PDF-1.4 Mock Document Content for Demonstration Purposes');
    }

    // 5. Create Applications with Various Statuses

    // App 1: Rohan -> ALLOCATED (Fully completed flow)
    const app1 = await Application.create({
      applicant: student1._id,
      applicationNumber: 'IEM-2026-1001',
      personalInfo: {
        fullName: 'Rohan Sharma',
        dateOfBirth: new Date('2005-04-15'),
        gender: 'Male',
        category: 'General',
        nationality: 'Indian',
        bloodGroup: 'O+',
        guardianName: 'Sanjay Sharma',
        guardianPhone: '9830119988'
      },
      contactInfo: {
        email: 'rohan.sharma@example.com',
        phone: '9830112233',
        addressLine: 'Flat 4B, Greenwood Apartments, Sector 5',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700091'
      },
      academicInfo: {
        tenthBoard: 'CBSE',
        tenthSchool: 'Delhi Public School',
        tenthYear: 2022,
        tenthPercentage: 92.5,
        twelfthBoard: 'CBSE',
        twelfthSchool: 'Delhi Public School',
        twelfthYear: 2024,
        twelfthPercentage: 89.2,
        stream: 'Science (PCM)'
      },
      courseSelection: {
        department: 'Computer Science & Engineering',
        program: 'B.Tech',
        courseId: createdCourses[0]._id
      },
      examInfo: {
        examName: 'IEMJEE 2026',
        rollNumber: 'IEMJEE-2026-908123',
        rankOrScore: 142
      },
      status: 'ALLOCATED',
      paymentStatus: 'PAID',
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Payment for App 1
    await Payment.create({
      applicationId: app1._id,
      applicantId: student1._id,
      amount: 500,
      paymentStatus: 'SUCCESS',
      transactionId: 'TXN-IEM-20260401-ROH91',
      paymentMethod: 'UPI / NetBanking',
      paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Documents for App 1
    await Document.create([
      {
        applicationId: app1._id,
        applicantId: student1._id,
        documentType: '10th_Marksheet',
        originalFileName: 'rohan_class10_marksheet.pdf',
        storedFileName: 'sample_marksheet.pdf',
        filePath: '/uploads/sample_marksheet.pdf',
        mimeType: 'application/pdf',
        fileSize: 245000,
        verificationStatus: 'VERIFIED'
      },
      {
        applicationId: app1._id,
        applicantId: student1._id,
        documentType: '12th_Marksheet',
        originalFileName: 'rohan_class12_marksheet.pdf',
        storedFileName: 'sample_marksheet.pdf',
        filePath: '/uploads/sample_marksheet.pdf',
        mimeType: 'application/pdf',
        fileSize: 310000,
        verificationStatus: 'VERIFIED'
      },
      {
        applicationId: app1._id,
        applicantId: student1._id,
        documentType: 'Photograph',
        originalFileName: 'rohan_passport_photo.png',
        storedFileName: 'sample_marksheet.pdf',
        filePath: '/uploads/sample_marksheet.pdf',
        mimeType: 'image/png',
        fileSize: 180000,
        verificationStatus: 'VERIFIED'
      }
    ]);

    // Seat allocation for App 1
    await SeatAllocation.create({
      applicationId: app1._id,
      applicantId: student1._id,
      courseId: createdCourses[0]._id,
      round: 1,
      seatStatus: 'CONFIRMED',
      allocationDate: new Date(),
      remarks: 'Allocated under General Merit Quota'
    });

    // Exam for App 1
    await Exam.create({
      applicationId: app1._id,
      applicantId: student1._id,
      examName: 'IEMJEE 2026 Phase-1',
      examDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      examVenue: 'IEM Salt Lake Campus Block-GN',
      examStatus: 'COMPLETED',
      score: 185,
      rank: 142,
      admitCardNumber: 'IEMJEE-2026-908123'
    });

    // App 2: Ananya -> APPROVED
    const app2 = await Application.create({
      applicant: student2._id,
      applicationNumber: 'IEM-2026-1002',
      personalInfo: {
        fullName: 'Ananya Sen',
        dateOfBirth: new Date('2005-08-20'),
        gender: 'Female',
        category: 'General',
        nationality: 'Indian',
        bloodGroup: 'B+',
        guardianName: 'Prabir Sen',
        guardianPhone: '9830229988'
      },
      contactInfo: {
        email: 'ananya.sen@example.com',
        phone: '9830223344',
        addressLine: '12 Ballygunge Circular Road',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700019'
      },
      academicInfo: {
        tenthBoard: 'ICSE',
        tenthSchool: 'Modern High School',
        tenthYear: 2022,
        tenthPercentage: 95.0,
        twelfthBoard: 'ISC',
        twelfthSchool: 'Modern High School',
        twelfthYear: 2024,
        twelfthPercentage: 93.8,
        stream: 'Science (PCM)'
      },
      courseSelection: {
        department: 'Information Technology',
        program: 'B.Tech',
        courseId: createdCourses[1]._id
      },
      status: 'APPROVED',
      paymentStatus: 'PAID',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await Payment.create({
      applicationId: app2._id,
      applicantId: student2._id,
      amount: 500,
      paymentStatus: 'SUCCESS',
      transactionId: 'TXN-IEM-20260405-ANA82',
      paymentMethod: 'NetBanking',
      paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await Document.create({
      applicationId: app2._id,
      applicantId: student2._id,
      documentType: '12th_Marksheet',
      originalFileName: 'ananya_12th_marksheet.pdf',
      storedFileName: 'sample_marksheet.pdf',
      filePath: '/uploads/sample_marksheet.pdf',
      verificationStatus: 'VERIFIED'
    });

    // App 3: Arjun -> DOCUMENT_VERIFICATION
    const app3 = await Application.create({
      applicant: student3._id,
      applicationNumber: 'IEM-2026-1003',
      personalInfo: {
        fullName: 'Arjun Mukherjee',
        dateOfBirth: new Date('2004-12-10'),
        gender: 'Male',
        category: 'General',
        nationality: 'Indian',
        guardianName: 'Subir Mukherjee',
        guardianPhone: '9830339911'
      },
      contactInfo: {
        email: 'arjun.m@example.com',
        phone: '9830334455',
        addressLine: '54 Lake Gardens',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700045'
      },
      academicInfo: {
        tenthBoard: 'WBSE',
        tenthSchool: 'South Point High School',
        tenthYear: 2022,
        tenthPercentage: 88.0,
        twelfthBoard: 'WBCHSE',
        twelfthSchool: 'South Point High School',
        twelfthYear: 2024,
        twelfthPercentage: 86.4,
        stream: 'Science (PCM)'
      },
      courseSelection: {
        department: 'Electronics & Communication',
        program: 'B.Tech',
        courseId: createdCourses[2]._id
      },
      status: 'DOCUMENT_VERIFICATION',
      paymentStatus: 'PAID',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    await Payment.create({
      applicationId: app3._id,
      applicantId: student3._id,
      amount: 500,
      paymentStatus: 'SUCCESS',
      transactionId: 'TXN-IEM-20260408-ARJ33',
      paymentMethod: 'Debit Card',
      paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    await Document.create({
      applicationId: app3._id,
      applicantId: student3._id,
      documentType: '10th_Marksheet',
      originalFileName: 'arjun_class10.pdf',
      storedFileName: 'sample_marksheet.pdf',
      filePath: '/uploads/sample_marksheet.pdf',
      verificationStatus: 'PENDING'
    });

    // App 4: Pooja -> SUBMITTED
    const app4 = await Application.create({
      applicant: student4._id,
      applicationNumber: 'IEM-2026-1004',
      personalInfo: {
        fullName: 'Pooja Das',
        dateOfBirth: new Date('2005-02-28'),
        gender: 'Female',
        category: 'OBC',
        nationality: 'Indian'
      },
      contactInfo: {
        email: 'pooja.das@example.com',
        phone: '9830445566',
        addressLine: 'Block C, Newtown Action Area 1',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700156'
      },
      academicInfo: {
        tenthBoard: 'CBSE',
        tenthSchool: 'Auxilium Convent',
        tenthYear: 2022,
        tenthPercentage: 84.0,
        twelfthBoard: 'CBSE',
        twelfthSchool: 'Auxilium Convent',
        twelfthYear: 2024,
        twelfthPercentage: 82.5,
        stream: 'Commerce with Maths'
      },
      courseSelection: {
        department: 'Computer Applications',
        program: 'BCA',
        courseId: createdCourses[4]._id
      },
      status: 'SUBMITTED',
      paymentStatus: 'PAID',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    await Payment.create({
      applicationId: app4._id,
      applicantId: student4._id,
      amount: 500,
      paymentStatus: 'SUCCESS',
      transactionId: 'TXN-IEM-20260409-POO44',
      paymentMethod: 'UPI',
      paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // App 5: Vikram -> DRAFT (In-progress)
    await Application.create({
      applicant: student5._id,
      applicationNumber: 'IEM-2026-1005',
      personalInfo: {
        fullName: 'Vikram Ghosh',
        dateOfBirth: new Date('2005-11-05'),
        gender: 'Male',
        category: 'General',
        nationality: 'Indian'
      },
      contactInfo: {
        email: 'vikram.g@example.com',
        phone: '9830556677'
      },
      status: 'DRAFT',
      paymentStatus: 'PENDING'
    });

    // Notifications
    await Notification.create([
      {
        userId: student1._id,
        title: 'Seat Allocation Completed',
        message: 'Your seat in B.Tech Computer Science & Engineering has been confirmed.',
        type: 'SUCCESS'
      },
      {
        userId: student2._id,
        title: 'Application Approved',
        message: 'Your application has been approved. You will be scheduled for counselling soon.',
        type: 'SUCCESS'
      },
      {
        userId: student3._id,
        title: 'Documents Under Verification',
        message: 'Your documents are being checked by the admission verification cell.',
        type: 'ACTION_REQUIRED'
      },
      {
        userId: student4._id,
        title: 'Application Received',
        message: 'Your submission has been queued for initial review.',
        type: 'INFO'
      }
    ]);

    console.log('Database Seeding Completed Successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding Error:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = seedDB;
