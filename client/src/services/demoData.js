// Persistent store and demo data management for IEM Admission Portal

export const INITIAL_COURSES = [
  {
    _id: '6af306abd66f6850c18c2ca4',
    programName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 180,
    availableSeats: 140,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank',
    isActive: true
  },
  {
    _id: '6af306abd66f6850c18c2ca7',
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
    _id: '6af306abd66f6850c18c2caa',
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
    _id: '6af306abd66f6850c18c2cad',
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
    _id: '6af306abd66f6850c18c2cb0',
    programName: 'Bachelor of Computer Applications (BCA)',
    department: 'Computer Applications',
    degree: 'BCA',
    durationYears: 3,
    totalSeats: 150,
    availableSeats: 90,
    applicationFee: 500,
    eligibility: '10+2 in any stream with Mathematics/Computer Science (min 50%)',
    isActive: true
  },
  {
    _id: '6af306acd66f6850c18c2cb3',
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
    _id: '6af306acd66f6850c18c2cb6',
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

export const INITIAL_APPLICATIONS = [
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
      program: 'B.Tech Computer Science & Engineering',
      courseId: '6af306abd66f6850c18c2ca4'
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
      program: 'B.Tech Information Technology',
      courseId: '6af306abd66f6850c18c2ca7'
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
      program: 'B.Tech Electronics & Communication Engineering',
      courseId: '6af306abd66f6850c18c2caa'
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
      program: 'Bachelor of Computer Applications (BCA)',
      courseId: '6af306abd66f6850c18c2cb0'
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
      program: 'B.Tech Computer Science & Engineering',
      courseId: '6af306abd66f6850c18c2ca4'
    },
    status: 'DRAFT',
    paymentStatus: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

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

// Course Seats State Management
export const getStoredCourses = () => {
  try {
    const raw = localStorage.getItem('iem_courses');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored courses:', e);
  }
  localStorage.setItem('iem_courses', JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
};

export const saveStoredCourses = (courses) => {
  localStorage.setItem('iem_courses', JSON.stringify(courses));
  return courses;
};

export const decrementCourseSeat = (courseIdentifier) => {
  if (!courseIdentifier) return getStoredCourses();
  const courses = getStoredCourses();
  const target = String(courseIdentifier).trim().toLowerCase();

  const course = courses.find((c) =>
    c._id === courseIdentifier ||
    c.programName.toLowerCase() === target ||
    c.programName.toLowerCase().includes(target) ||
    target.includes(c.programName.toLowerCase())
  );

  if (course && course.availableSeats > 0) {
    course.availableSeats -= 1;
    saveStoredCourses(courses);
    console.log(`[Seats Updated] ${course.programName} remaining available seats: ${course.availableSeats}`);
  }
  return courses;
};

// Application State Management
export const getStoredApplications = () => {
  try {
    const raw = localStorage.getItem('iem_applications');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored applications:', e);
  }
  localStorage.setItem('iem_applications', JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
};

export const saveStoredApplications = (apps) => {
  localStorage.setItem('iem_applications', JSON.stringify(apps));
  return apps;
};

export const getApplicationForUser = (user) => {
  if (!user) return null;
  const apps = getStoredApplications();

  // If logged in as Rohan
  if (user.email === 'rohan.sharma@example.com') {
    return apps.find((a) => a.applicant?.email === 'rohan.sharma@example.com') || apps[0];
  }

  // Check if this user already has an application
  let found = apps.find(
    (a) =>
      (a.applicant?._id && String(a.applicant._id) === String(user.id || user._id)) ||
      (a.applicant?.email && a.applicant.email.toLowerCase() === user.email?.toLowerCase()) ||
      (a.contactInfo?.email && a.contactInfo.email.toLowerCase() === user.email?.toLowerCase())
  );

  if (!found) {
    const randomAppNo = `IEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      _id: `app-user-${user.id || user._id || Date.now()}`,
      applicationNumber: randomAppNo,
      applicant: {
        _id: user.id || user._id || `usr-${Date.now()}`,
        name: user.name || 'Registered Applicant',
        email: user.email || '',
        phone: user.phone || ''
      },
      personalInfo: {
        fullName: user.name || '',
        dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
        gender: 'Male',
        category: 'General',
        nationality: 'Indian',
        bloodGroup: '',
        guardianName: '',
        guardianPhone: ''
      },
      contactInfo: {
        email: user.email || '',
        phone: user.phone || '',
        addressLine: '',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: ''
      },
      academicInfo: {
        tenthBoard: 'CBSE',
        tenthSchool: '',
        tenthYear: 2022,
        tenthPercentage: '',
        twelfthBoard: 'CBSE',
        twelfthSchool: '',
        twelfthYear: 2024,
        twelfthPercentage: '',
        stream: 'Science (PCM)'
      },
      courseSelection: {
        department: '',
        program: '',
        courseId: ''
      },
      examInfo: {
        examName: 'IEMJEE 2026',
        rollNumber: '',
        rankOrScore: ''
      },
      status: 'DRAFT',
      paymentStatus: 'PAID',
      documents: [],
      createdAt: new Date().toISOString()
    };

    apps.unshift(newApp);
    saveStoredApplications(apps);
    return newApp;
  }

  return found;
};

export const saveOrUpdateApplication = (appData, user) => {
  const apps = getStoredApplications();
  let existingIndex = -1;

  if (appData._id) {
    existingIndex = apps.findIndex((a) => a._id === appData._id || a.applicationNumber === appData._id);
  }
  if (existingIndex === -1 && user?.email) {
    existingIndex = apps.findIndex(
      (a) =>
        a.applicant?.email?.toLowerCase() === user.email.toLowerCase() ||
        a.contactInfo?.email?.toLowerCase() === user.email.toLowerCase()
    );
  }

  let updatedApp;
  if (existingIndex >= 0) {
    updatedApp = {
      ...apps[existingIndex],
      ...appData,
      applicant: {
        ...apps[existingIndex].applicant,
        name: appData.personalInfo?.fullName || apps[existingIndex].applicant?.name,
        email: appData.contactInfo?.email || apps[existingIndex].applicant?.email,
        phone: appData.contactInfo?.phone || apps[existingIndex].applicant?.phone
      },
      personalInfo: {
        ...apps[existingIndex].personalInfo,
        ...appData.personalInfo
      },
      contactInfo: {
        ...apps[existingIndex].contactInfo,
        ...appData.contactInfo
      },
      academicInfo: {
        ...apps[existingIndex].academicInfo,
        ...appData.academicInfo
      },
      courseSelection: {
        ...apps[existingIndex].courseSelection,
        ...appData.courseSelection
      },
      examInfo: {
        ...apps[existingIndex].examInfo,
        ...appData.examInfo
      },
      updatedAt: new Date().toISOString()
    };
    apps[existingIndex] = updatedApp;
  } else {
    updatedApp = {
      _id: appData._id || `app-${Date.now()}`,
      applicationNumber: appData.applicationNumber || `IEM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicant: {
        _id: user?.id || user?._id || `user-${Date.now()}`,
        name: appData.personalInfo?.fullName || user?.name || 'Registered Applicant',
        email: appData.contactInfo?.email || user?.email || '',
        phone: appData.contactInfo?.phone || user?.phone || ''
      },
      personalInfo: appData.personalInfo || {},
      contactInfo: appData.contactInfo || {},
      academicInfo: appData.academicInfo || {},
      courseSelection: appData.courseSelection || {},
      examInfo: appData.examInfo || {},
      status: appData.status || 'DRAFT',
      paymentStatus: appData.paymentStatus || 'PAID',
      documents: [],
      createdAt: new Date().toISOString()
    };
    apps.unshift(updatedApp);
  }

  saveStoredApplications(apps);
  return updatedApp;
};

export const submitStudentApplication = (appId, user) => {
  const apps = getStoredApplications();
  let app = apps.find((a) => a._id === appId || a.applicationNumber === appId);

  if (!app && user) {
    app = getApplicationForUser(user);
  }

  if (app) {
    app.status = 'SUBMITTED';
    app.paymentStatus = 'PAID';
    app.submittedAt = new Date().toISOString();

    // Reduce available seats by 1 for the selected course
    const courseId = app.courseSelection?.courseId || app.courseSelection?.program;
    if (courseId) {
      decrementCourseSeat(courseId);
    }

    saveStoredApplications(apps);
    return app;
  }

  return null;
};

export const getDashboardStatsFromStored = () => {
  const apps = getStoredApplications();
  const courses = getStoredCourses();

  const statusDistribution = {
    DRAFT: 0,
    SUBMITTED: 0,
    UNDER_REVIEW: 0,
    DOCUMENT_VERIFICATION: 0,
    APPROVED: 0,
    REJECTED: 0,
    COUNSELLING: 0,
    ALLOCATED: 0
  };

  const deptCountMap = {};

  apps.forEach((a) => {
    if (a.status && statusDistribution[a.status] !== undefined) {
      statusDistribution[a.status] += 1;
    }
    const dept = a.courseSelection?.department || 'General';
    deptCountMap[dept] = (deptCountMap[dept] || 0) + 1;
  });

  const departmentDistribution = Object.keys(deptCountMap).map((d) => ({
    _id: d,
    count: deptCountMap[d]
  }));

  const pendingApplications =
    (statusDistribution.SUBMITTED || 0) +
    (statusDistribution.UNDER_REVIEW || 0) +
    (statusDistribution.DOCUMENT_VERIFICATION || 0);

  const approvedApplications =
    (statusDistribution.APPROVED || 0) +
    (statusDistribution.COUNSELLING || 0) +
    (statusDistribution.ALLOCATED || 0);

  return {
    summary: {
      totalApplications: apps.length,
      totalStudents: apps.length,
      totalCourses: courses.length,
      pendingApplications,
      approvedApplications,
      rejectedApplications: statusDistribution.REJECTED || 0,
      totalRevenue: apps.filter((a) => a.paymentStatus === 'PAID').length * 500,
      totalTransactions: apps.filter((a) => a.paymentStatus === 'PAID').length
    },
    statusDistribution,
    departmentDistribution,
    recentApplications: apps.slice(0, 5)
  };
};

export const DEMO_EXAMS = [
  {
    _id: 'exam-01',
    applicant: INITIAL_APPLICATIONS[0].applicant,
    application: INITIAL_APPLICATIONS[0]._id,
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
    applicant: INITIAL_APPLICATIONS[1].applicant,
    application: INITIAL_APPLICATIONS[1]._id,
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
    applicant: INITIAL_APPLICATIONS[0].applicant,
    application: INITIAL_APPLICATIONS[0],
    allocatedCourse: INITIAL_COURSES[0],
    department: 'Computer Science & Engineering',
    program: 'B.Tech Computer Science & Engineering',
    seatCategory: 'General Merit',
    quota: 'General',
    allotmentStatus: 'CONFIRMED',
    allocationDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    remarks: 'Candidate selected B.Tech CSE as 1st preference and confirmed admission.'
  }
];
