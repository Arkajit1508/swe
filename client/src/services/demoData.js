// Demo fallback data for seamless presentation and lab demonstration

export const DEMO_ADMIN_USER = {
  id: 'demo-admin-iem-001',
  _id: 'demo-admin-iem-001',
  name: 'IEM Admissions Dean',
  email: 'admin@iem.edu',
  phone: '9876543210',
  role: 'admin',
  isDemo: true
};

export const DEMO_STUDENT_USER = {
  id: 'demo-student-rohan-001',
  _id: 'demo-student-rohan-001',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@example.com',
  phone: '9830112233',
  dateOfBirth: '2005-04-15',
  role: 'student',
  isDemo: true
};

export const DEMO_COURSES = [
  {
    _id: 'course-cse-01',
    programName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 180,
    availableSeats: 142,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank',
    isActive: true
  },
  {
    _id: 'course-it-02',
    programName: 'B.Tech Information Technology',
    department: 'Information Technology',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 98,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank',
    isActive: true
  },
  {
    _id: 'course-ece-03',
    programName: 'B.Tech Electronics & Communication Engineering',
    department: 'Electronics & Communication',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 85,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank',
    isActive: true
  },
  {
    _id: 'course-csbs-04',
    programName: 'B.Tech Computer Science & Business Systems',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 60,
    availableSeats: 45,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate',
    isActive: true
  },
  {
    _id: 'course-bca-05',
    programName: 'Bachelor of Computer Applications (BCA)',
    department: 'Computer Applications',
    degree: 'BCA',
    durationYears: 3,
    totalSeats: 120,
    availableSeats: 90,
    applicationFee: 500,
    eligibility: '10+2 in any stream with Mathematics/Computer Science (min 50%)',
    isActive: true
  },
  {
    _id: 'course-mca-06',
    programName: 'Master of Computer Applications (MCA)',
    department: 'Computer Applications',
    degree: 'MCA',
    durationYears: 2,
    totalSeats: 60,
    availableSeats: 35,
    applicationFee: 500,
    eligibility: 'BCA/B.Sc Computer Science with min 50% + JECA rank',
    isActive: true
  },
  {
    _id: 'course-mba-07',
    programName: 'Master of Business Administration (MBA)',
    department: 'Management Studies',
    degree: 'MBA',
    durationYears: 2,
    totalSeats: 120,
    availableSeats: 70,
    applicationFee: 500,
    eligibility: 'Graduation in any discipline with min 50% + CAT/MAT/JEMAT score',
    isActive: true
  }
];

export const DEMO_APPLICATIONS = [
  {
    _id: 'app-rohan-1001',
    applicationNumber: 'IEM-2026-1001',
    applicant: {
      _id: 'demo-student-rohan-001',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '9830112233'
    },
    personalInfo: {
      fullName: 'Rohan Sharma',
      dateOfBirth: '2005-04-15',
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
      program: 'B.Tech'
    },
    examInfo: {
      examName: 'IEMJEE 2026',
      rollNumber: 'IEMJEE-2026-908123',
      rankOrScore: 142
    },
    status: 'ALLOCATED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: 'app-ananya-1002',
    applicationNumber: 'IEM-2026-1002',
    applicant: {
      _id: 'stu-ananya-02',
      name: 'Ananya Sen',
      email: 'ananya.sen@example.com',
      phone: '9830223344'
    },
    personalInfo: {
      fullName: 'Ananya Sen',
      dateOfBirth: '2005-08-20',
      gender: 'Female',
      category: 'General',
      nationality: 'Indian',
      bloodGroup: 'B+',
      guardianName: 'Debabrata Sen',
      guardianPhone: '9830228899'
    },
    contactInfo: {
      email: 'ananya.sen@example.com',
      phone: '9830223344',
      addressLine: '12 Salt Lake, BD Block',
      city: 'Kolkata',
      state: 'West Bengal',
      pinCode: '700064'
    },
    academicInfo: {
      tenthBoard: 'ICSE',
      tenthSchool: 'Modern High School',
      tenthYear: 2022,
      tenthPercentage: 95.0,
      twelfthBoard: 'ISC',
      twelfthSchool: 'Modern High School',
      twelfthYear: 2024,
      twelfthPercentage: 93.4,
      stream: 'Science (PCM)'
    },
    courseSelection: {
      department: 'Information Technology',
      program: 'B.Tech'
    },
    examInfo: {
      examName: 'WBJEE 2026',
      rollNumber: 'WBJEE-2026-445129',
      rankOrScore: 389
    },
    status: 'APPROVED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: 'app-arjun-1003',
    applicationNumber: 'IEM-2026-1003',
    applicant: {
      _id: 'stu-arjun-03',
      name: 'Arjun Mukherjee',
      email: 'arjun.m@example.com',
      phone: '9830334455'
    },
    personalInfo: {
      fullName: 'Arjun Mukherjee',
      dateOfBirth: '2004-12-10',
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
      program: 'B.Tech'
    },
    status: 'DOCUMENT_VERIFICATION',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'app-pooja-1004',
    applicationNumber: 'IEM-2026-1004',
    applicant: {
      _id: 'stu-pooja-04',
      name: 'Pooja Das',
      email: 'pooja.das@example.com',
      phone: '9830445566'
    },
    personalInfo: {
      fullName: 'Pooja Das',
      dateOfBirth: '2005-02-28',
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
      program: 'BCA'
    },
    status: 'SUBMITTED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: 'app-vikram-1005',
    applicationNumber: 'IEM-2026-1005',
    applicant: {
      _id: 'stu-vikram-05',
      name: 'Vikram Ghosh',
      email: 'vikram.g@example.com',
      phone: '9830556677'
    },
    personalInfo: {
      fullName: 'Vikram Ghosh',
      dateOfBirth: '2005-11-05',
      gender: 'Male',
      category: 'General',
      nationality: 'Indian'
    },
    contactInfo: {
      email: 'vikram.g@example.com',
      phone: '9830556677'
    },
    courseSelection: {
      department: 'Computer Science & Engineering',
      program: 'B.Tech'
    },
    status: 'DRAFT',
    paymentStatus: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

export const DEMO_ADMIN_DASHBOARD = {
  summary: {
    totalApplications: 5,
    totalStudents: 5,
    totalCourses: 7,
    pendingApplications: 2,
    approvedApplications: 2,
    rejectedApplications: 0,
    totalRevenue: 2000,
    totalTransactions: 4
  },
  statusDistribution: {
    DRAFT: 1,
    SUBMITTED: 1,
    UNDER_REVIEW: 0,
    DOCUMENT_VERIFICATION: 1,
    APPROVED: 1,
    REJECTED: 0,
    COUNSELLING: 0,
    ALLOCATED: 1
  },
  departmentDistribution: [
    { _id: 'Computer Science & Engineering', count: 2 },
    { _id: 'Information Technology', count: 1 },
    { _id: 'Electronics & Communication', count: 1 },
    { _id: 'Computer Applications', count: 1 }
  ],
  programDistribution: [
    { _id: 'B.Tech', count: 4 },
    { _id: 'BCA', count: 1 }
  ],
  recentApplications: DEMO_APPLICATIONS.slice(0, 5)
};

export const DEMO_EXAMS = [
  {
    _id: 'exam-01',
    applicant: DEMO_APPLICATIONS[0].applicant,
    application: DEMO_APPLICATIONS[0]._id,
    applicationNumber: 'IEM-2026-1001',
    examName: 'IEMJEE 2026',
    rollNumber: 'IEMJEE-2026-908123',
    examDate: '2026-05-15',
    marks: 94,
    rank: 142,
    examStatus: 'COMPLETED'
  },
  {
    _id: 'exam-02',
    applicant: DEMO_APPLICATIONS[1].applicant,
    application: DEMO_APPLICATIONS[1]._id,
    applicationNumber: 'IEM-2026-1002',
    examName: 'WBJEE 2026',
    rollNumber: 'WBJEE-2026-445129',
    examDate: '2026-04-28',
    marks: 88,
    rank: 389,
    examStatus: 'COMPLETED'
  }
];

export const DEMO_ALLOCATIONS = [
  {
    _id: 'alloc-01',
    applicant: DEMO_APPLICATIONS[0].applicant,
    application: DEMO_APPLICATIONS[0],
    allocatedCourse: DEMO_COURSES[0],
    department: 'Computer Science & Engineering',
    program: 'B.Tech',
    seatCategory: 'General Merit',
    quota: 'General',
    allotmentStatus: 'CONFIRMED',
    allocationDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    remarks: 'Candidate selected B.Tech CSE as 1st preference and confirmed admission.'
  }
];
