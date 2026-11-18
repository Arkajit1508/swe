// Persistent store and demo data management for IEM Admission Portal

export const INITIAL_COURSES = [
  {
    _id: '6af306abd66f6850c18c2ca4',
    programName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 180,
    availableSeats: 139,
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
    _id: 'app-arkajit-bhattacharya-1000',
    applicationNumber: 'IEM-2026-1000',
    applicant: {
      _id: 'usr-arkajit-bhattacharya',
      name: 'Arkajit Bhattacharya',
      email: 'arkajit.bhattacharya@iem.edu',
      phone: '9876543210'
    },
    personalInfo: {
      fullName: 'Arkajit Bhattacharya',
      dateOfBirth: '2005-01-15',
      gender: 'Male',
      category: 'General',
      nationality: 'Indian',
      bloodGroup: 'B+',
      guardianName: 'Guardian',
      guardianPhone: '9830112233'
    },
    contactInfo: {
      email: 'arkajit.bhattacharya@iem.edu',
      phone: '9876543210',
      addressLine: 'Sector V, Salt Lake',
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
      twelfthPercentage: 89.4,
      stream: 'Science (PCM)'
    },
    courseSelection: {
      department: 'Computer Science & Engineering',
      program: 'B.Tech Computer Science & Engineering',
      courseId: '6af306abd66f6850c18c2ca4'
    },
    examInfo: {
      examName: 'IEMJEE 2026',
      rollNumber: 'IEMJEE-2026-1000',
      rankOrScore: 98
    },
    status: 'SUBMITTED',
    paymentStatus: 'PAID',
    submittedByUser: true,
    documents: [
      {
        _id: 'doc-arkajit-01',
        documentType: '10th_Marksheet',
        originalFileName: 'arkajit_class10.pdf',
        fileSize: '1.2 MB',
        verificationStatus: 'PENDING'
      },
      {
        _id: 'doc-arkajit-02',
        documentType: '12th_Marksheet',
        originalFileName: 'arkajit_class12.pdf',
        fileSize: '1.4 MB',
        verificationStatus: 'PENDING'
      }
    ],
    createdAt: new Date().toISOString(),
    submittedAt: new Date().toISOString()
  },
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
    documents: [
      {
        _id: 'doc-ananya-01',
        documentType: '10th_Marksheet',
        originalFileName: 'ananya_class10.pdf',
        fileSize: '1.2 MB',
        verificationStatus: 'VERIFIED'
      },
      {
        _id: 'doc-ananya-02',
        documentType: '12th_Marksheet',
        originalFileName: 'ananya_class12.pdf',
        fileSize: '1.4 MB',
        verificationStatus: 'VERIFIED'
      }
    ],
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
    documents: [
      {
        _id: 'doc-arjun-01',
        documentType: '10th_Marksheet',
        originalFileName: 'arjun_class10.pdf',
        fileSize: '1.2 MB',
        verificationStatus: 'PENDING'
      },
      {
        _id: 'doc-arjun-02',
        documentType: '12th_Marksheet',
        originalFileName: 'arjun_class12.pdf',
        fileSize: '1.4 MB',
        verificationStatus: 'PENDING'
      }
    ],
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
    documents: [
      {
        _id: 'doc-pooja-01',
        documentType: '10th_Marksheet',
        originalFileName: 'pooja_class10.pdf',
        fileSize: '1.1 MB',
        verificationStatus: 'PENDING'
      },
      {
        _id: 'doc-pooja-02',
        documentType: '12th_Marksheet',
        originalFileName: 'pooja_class12.pdf',
        fileSize: '1.3 MB',
        verificationStatus: 'PENDING'
      }
    ],
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
let memoryCourses = null;

export const getStoredCourses = () => {
  let courses = [...INITIAL_COURSES];
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('iem_courses');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) courses = parsed;
      }
    } else if (memoryCourses) {
      courses = [...memoryCourses];
    }
  } catch (e) {
    console.warn('Error reading stored courses:', e);
  }

  // Count confirmed allocations to ensure available seats reflect real-time count
  const allocations = getStoredAllocations();

  // Base available seat capacities before counselling allocations
  const BASE_CAPACITIES = {
    'B.Tech Computer Science & Engineering': 140,
    'B.Tech Information Technology': 99,
    'B.Tech Electronics & Communication Engineering': 85,
    'B.Tech Computer Science & Business Systems': 45,
    'Bachelor of Computer Applications (BCA)': 90,
    'Master of Computer Applications (MCA)': 35,
    'Master of Business Administration (MBA)': 70
  };

  // Adjust baseline seats dynamically based on allocations
  courses = courses.map((c) => {
    // Count how many allocated for this course
    const allocCount = allocations.filter((al) => {
      const prog = al.courseId?.programName || al.program || al.allocatedCourse?.programName;
      return prog && (
        prog.toLowerCase() === c.programName.toLowerCase() ||
        c.programName.toLowerCase().includes(prog.toLowerCase()) ||
        prog.toLowerCase().includes(c.programName.toLowerCase())
      );
    }).length;

    const baseAvailable = BASE_CAPACITIES[c.programName] !== undefined 
      ? BASE_CAPACITIES[c.programName] 
      : (c.totalSeats || 60);

    const calculatedAvail = Math.max(0, baseAvailable - allocCount);
    return { ...c, availableSeats: calculatedAvail };
  });

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_courses', JSON.stringify(courses));
  } else {
    memoryCourses = courses;
  }
  return courses;
};

export const saveStoredCourses = (courses) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_courses', JSON.stringify(courses));
  }
  memoryCourses = courses;
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
    console.log('[Seats Updated] ' + course.programName + ' remaining available seats: ' + course.availableSeats);
  }

  return courses;
};

// Persistent Registered Users list
export const getRegisteredUsers = () => {
  let users = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('iem_registered_users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) users = parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading registered users:', e);
  }

  // Ensure default candidate profiles exist
  const defaultUsers = [
    {
      id: INITIAL_APPLICATIONS[0].applicant._id,
      _id: INITIAL_APPLICATIONS[0].applicant._id,
      name: INITIAL_APPLICATIONS[0].applicant.name,
      email: INITIAL_APPLICATIONS[0].applicant.email,
      phone: INITIAL_APPLICATIONS[0].applicant.phone,
      dateOfBirth: '2005-01-15',
      role: 'student',
      registeredAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: DEMO_STUDENT_USER._id,
      _id: DEMO_STUDENT_USER._id,
      name: DEMO_STUDENT_USER.name,
      email: DEMO_STUDENT_USER.email,
      phone: DEMO_STUDENT_USER.phone,
      dateOfBirth: DEMO_STUDENT_USER.dateOfBirth,
      role: 'student',
      registeredAt: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: INITIAL_APPLICATIONS[2].applicant._id,
      _id: INITIAL_APPLICATIONS[2].applicant._id,
      name: INITIAL_APPLICATIONS[2].applicant.name,
      email: INITIAL_APPLICATIONS[2].applicant.email,
      phone: INITIAL_APPLICATIONS[2].applicant.phone,
      dateOfBirth: '2005-08-22',
      role: 'student',
      registeredAt: new Date(Date.now() - 6 * 86400000).toISOString()
    }
  ];

  defaultUsers.forEach((def) => {
    const exists = users.some(
      (u) =>
        (u.email && u.email.toLowerCase() === def.email.toLowerCase()) ||
        (u.name && u.name.toLowerCase() === def.name.toLowerCase())
    );
    if (!exists) {
      users.push(def);
    }
  });

  return users;
};

export const addRegisteredUser = (userData) => {
  if (!userData) return null;
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(
    (u) =>
      (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase()) ||
      (userData.name && u.name?.toLowerCase() === userData.name.toLowerCase())
  );

  const newUser = {
    id: userData.id || userData._id || 'usr-' + Date.now(),
    _id: userData.id || userData._id || 'usr-' + Date.now(),
    name: userData.name || 'Registered Applicant',
    email: userData.email || '',
    phone: userData.phone || '9876543210',
    dateOfBirth: userData.dateOfBirth || '',
    role: 'student',
    registeredAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...newUser };
  } else {
    users.unshift(newUser);
  }

  localStorage.setItem('iem_registered_users', JSON.stringify(users));

  // Automatically create and sync application in store so admin sees them immediately!
  createApplicationForRegisteredUser(newUser);

  return newUser;
};

export const createApplicationForRegisteredUser = (user) => {
  if (!user) return null;
  let apps = [];
  try {
    const raw = localStorage.getItem('iem_applications');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) apps = parsed;
    }
  } catch {}
  if (!apps || apps.length === 0) {
    apps = [...INITIAL_APPLICATIONS];
  }

  // Check if this registered user already exists in apps
  const existing = apps.find(
    (a) =>
      (a.applicant?._id && String(a.applicant._id) === String(user.id || user._id)) ||
      (a.applicant?.email && user.email && a.applicant.email.toLowerCase() === user.email.toLowerCase()) ||
      (a.contactInfo?.email && user.email && a.contactInfo.email.toLowerCase() === user.email.toLowerCase()) ||
      (a.applicant?.name && user.name && a.applicant.name.toLowerCase() === user.name.toLowerCase()) ||
      (a.personalInfo?.fullName && user.name && a.personalInfo.fullName.toLowerCase() === user.name.toLowerCase())
  );

  if (existing) {
    if (user.name) {
      existing.applicant.name = user.name;
      existing.personalInfo.fullName = user.name;
    }
    if (user.email) {
      existing.applicant.email = user.email;
      existing.contactInfo.email = user.email;
    }
    if (user.phone) {
      existing.applicant.phone = user.phone;
      existing.contactInfo.phone = user.phone;
    }
    saveStoredApplications(apps);
    return existing;
  }

  // Create new applicant dossier record in pristine DRAFT state
  const appNo = 'IEM-2026-' + Math.floor(1000 + Math.random() * 9000);
  const newApp = {
    _id: 'app-' + (user.id || user._id || Date.now()),
    applicationNumber: appNo,
    applicant: {
      _id: user.id || user._id || ('usr-' + Date.now()),
      name: user.name || 'Applicant',
      email: user.email || '',
      phone: user.phone || ''
    },
    personalInfo: {
      fullName: user.name || 'Applicant',
      dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
      gender: user.gender || 'Male',
      category: user.category || 'General',
      nationality: 'Indian',
      bloodGroup: user.bloodGroup || '',
      guardianName: '',
      guardianPhone: ''
    },
    contactInfo: {
      email: user.email || '',
      phone: user.phone || '',
      addressLine: '',
      city: '',
      state: '',
      pinCode: ''
    },
    academicInfo: {
      tenthBoard: '',
      tenthSchool: '',
      tenthYear: '',
      tenthPercentage: '',
      twelfthBoard: '',
      twelfthSchool: '',
      twelfthYear: '',
      twelfthPercentage: '',
      stream: ''
    },
    courseSelection: {
      department: '',
      program: '',
      courseId: ''
    },
    examInfo: {
      examName: 'IEMJEE',
      rollNumber: '',
      rankOrScore: ''
    },
    status: 'DRAFT',
    paymentStatus: 'PENDING',
    documents: [],
    submittedByUser: false,
    createdAt: new Date().toISOString()
  };

  apps.unshift(newApp);
  saveStoredApplications(apps);

  return newApp;
};

// Application State Management
let memoryApps = null;

export const getStoredApplications = () => {
  let apps = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('iem_applications');
      if (raw) {
        apps = JSON.parse(raw);
      }
    }
  } catch (e) {
    console.warn('Error reading stored applications:', e);
  }

  if (!apps || !Array.isArray(apps) || apps.length === 0) {
    apps = memoryApps ? [...memoryApps] : [...INITIAL_APPLICATIONS];
  }

  // 1. Sync all registered users from iem_registered_users into the application list as clean DRAFT applications
  const registeredUsers = getRegisteredUsers();
  registeredUsers.forEach((user) => {
    const exists = apps.some(
      (a) =>
        (a.applicant?._id && String(a.applicant._id) === String(user.id || user._id)) ||
        (a.applicant?.email && user.email && a.applicant.email.toLowerCase() === user.email.toLowerCase()) ||
        (a.contactInfo?.email && user.email && a.contactInfo.email.toLowerCase() === user.email.toLowerCase()) ||
        (a.applicant?.name && user.name && a.applicant.name.toLowerCase() === user.name.toLowerCase()) ||
        (a.personalInfo?.fullName && user.name && a.personalInfo.fullName.toLowerCase() === user.name.toLowerCase())
    );
    if (!exists) {
      apps.unshift({
        _id: 'app-' + (user.id || user._id || Date.now()),
        applicationNumber: 'IEM-2026-' + Math.floor(1000 + Math.random() * 9000),
        applicant: {
          _id: user.id || user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        },
        personalInfo: {
          fullName: user.name,
          dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
          gender: 'Male',
          category: 'General',
          nationality: 'Indian',
          bloodGroup: '',
          guardianName: '',
          guardianPhone: ''
        },
        contactInfo: {
          email: user.email,
          phone: user.phone || '',
          addressLine: '',
          city: '',
          state: '',
          pinCode: ''
        },
        academicInfo: {
          tenthBoard: '',
          tenthSchool: '',
          tenthYear: '',
          tenthPercentage: '',
          twelfthBoard: '',
          twelfthSchool: '',
          twelfthYear: '',
          twelfthPercentage: '',
          stream: ''
        },
        courseSelection: {
          department: '',
          program: '',
          courseId: ''
        },
        examInfo: {
          examName: 'IEMJEE',
          rollNumber: '',
          rankOrScore: ''
        },
        status: 'DRAFT',
        paymentStatus: 'PENDING',
        documents: [],
        submittedByUser: false,
        createdAt: user.registeredAt || new Date().toISOString()
      });
    }
  });

  // 2. Ensure Arkajit's completed application is preserved with full submitted data
  const arkajitInitial = INITIAL_APPLICATIONS.find((a) => a.applicationNumber === 'IEM-2026-1000');
  const arkajitInApps = apps.find(
    (a) =>
      a.applicationNumber === 'IEM-2026-1000' ||
      a.applicant?.name?.toLowerCase().includes('arkajit') ||
      a.personalInfo?.fullName?.toLowerCase().includes('arkajit') ||
      a.contactInfo?.email?.toLowerCase().includes('arkajit')
  );

  if (arkajitInApps && arkajitInitial) {
    // If Arkajit was previously wiped or lacks academic/course details, restore his filled data
    if (!arkajitInApps.academicInfo?.tenthPercentage || arkajitInApps.status === 'DRAFT') {
      arkajitInApps.academicInfo = { ...arkajitInitial.academicInfo };
      arkajitInApps.courseSelection = { ...arkajitInitial.courseSelection };
      arkajitInApps.examInfo = { ...arkajitInitial.examInfo };
      arkajitInApps.documents = [...arkajitInitial.documents];
      arkajitInApps.status = 'SUBMITTED';
      arkajitInApps.paymentStatus = 'PAID';
      arkajitInApps.submittedByUser = true;
    }
  } else if (arkajitInitial) {
    apps.unshift({ ...arkajitInitial });
  }

  // 3. Ensure all base initial applications are preserved
  INITIAL_APPLICATIONS.forEach((baseApp) => {
    const exists = apps.some((a) => a.applicationNumber === baseApp.applicationNumber);
    if (!exists) {
      apps.push(baseApp);
    }
  });

  memoryApps = apps;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_applications', JSON.stringify(apps));
  }
  return apps;
};

export const saveStoredApplications = (apps) => {
  memoryApps = apps;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_applications', JSON.stringify(apps));
  }
  return apps;
};

export const getApplicationForUser = (user) => {
  if (!user) return null;
  const apps = getStoredApplications();

  // If user is Arkajit or Arkajit Bhattacharya (already registered with filled application)
  if (user.name?.toLowerCase().includes('arkajit') || user.email?.toLowerCase().includes('arkajit')) {
    const arkajitApp = apps.find(
      (a) =>
        a.applicationNumber === 'IEM-2026-1000' ||
        a.applicant?.name?.toLowerCase().includes('arkajit') ||
        a.personalInfo?.fullName?.toLowerCase().includes('arkajit') ||
        a.contactInfo?.email?.toLowerCase().includes('arkajit')
    );
    if (arkajitApp) return arkajitApp;
  }

  // If logged in as Rohan
  if (user.email === 'rohan.sharma@example.com') {
    return apps.find((a) => a.applicant?.email === 'rohan.sharma@example.com') || apps[0];
  }

  // Check if this user already has an application in the store
  let found = apps.find(
    (a) =>
      (a.applicant?._id && String(a.applicant._id) === String(user.id || user._id)) ||
      (a.applicant?.email && a.applicant.email.toLowerCase() === user.email?.toLowerCase()) ||
      (a.contactInfo?.email && a.contactInfo.email.toLowerCase() === user.email?.toLowerCase()) ||
      (a.applicant?.name && a.applicant.name.toLowerCase() === user.name?.toLowerCase()) ||
      (a.personalInfo?.fullName && a.personalInfo.fullName.toLowerCase() === user.name?.toLowerCase())
  );

  if (!found) {
    return createApplicationForRegisteredUser(user);
  }

  return found;
};

export const saveOrUpdateApplication = (appData, user) => {
  if (typeof appData === 'string') {
    try {
      appData = JSON.parse(appData);
    } catch {
      appData = {};
    }
  }

  const apps = getStoredApplications();
  let existingIndex = -1;

  if (appData._id) {
    existingIndex = apps.findIndex((a) => a._id === appData._id || a.applicationNumber === appData._id);
  }
  if (existingIndex === -1 && (user?.id || user?._id)) {
    const uid = String(user.id || user._id);
    existingIndex = apps.findIndex(
      (a) =>
        (a.applicant?._id && String(a.applicant._id) === uid) ||
        (a.applicant?.id && String(a.applicant.id) === uid)
    );
  }
  if (existingIndex === -1 && user?.email) {
    existingIndex = apps.findIndex(
      (a) =>
        a.applicant?.email?.toLowerCase() === user.email.toLowerCase() ||
        a.contactInfo?.email?.toLowerCase() === user.email.toLowerCase()
    );
  }
  if (existingIndex === -1 && (user?.name || appData.personalInfo?.fullName)) {
    const targetName = (appData.personalInfo?.fullName || user?.name || '').trim().toLowerCase();
    if (targetName) {
      existingIndex = apps.findIndex(
        (a) =>
          (a.applicant?.name && a.applicant.name.trim().toLowerCase() === targetName) ||
          (a.personalInfo?.fullName && a.personalInfo.fullName.trim().toLowerCase() === targetName)
      );
    }
  }

  let updatedApp;
  if (existingIndex >= 0) {
    updatedApp = {
      ...apps[existingIndex],
      ...appData,
      applicant: {
        ...apps[existingIndex].applicant,
        name: appData.personalInfo?.fullName || apps[existingIndex].applicant?.name,
        email: appData.contactInfo?.email || user?.email || apps[existingIndex].applicant?.email,
        phone: appData.contactInfo?.phone || user?.phone || apps[existingIndex].applicant?.phone
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
      status: apps[existingIndex].status || 'DRAFT',
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
      paymentStatus: appData.paymentStatus || 'PENDING',
      documents: appData.documents || [],
      submittedByUser: false,
      createdAt: new Date().toISOString()
    };
    apps.unshift(updatedApp);
  }

  if (typeof localStorage !== 'undefined') {
    if (appData.personalInfo?.dateOfBirth) {
      localStorage.setItem('iem_registered_dob', String(appData.personalInfo.dateOfBirth).slice(0, 10));
    }
  }

  saveStoredApplications(apps);
  return updatedApp;
};

export const submitStudentApplication = (appId, user) => {
  const apps = getStoredApplications();
  let app = null;
  if (appId) {
    app = apps.find((a) => a._id === appId || a.applicationNumber === appId);
  }

  if (!app && user) {
    const uEmail = user.email?.toLowerCase();
    const uName = user.name?.toLowerCase();
    app = apps.find((a) =>
      (a.applicant && (a.applicant._id === user.id || (a.applicant.email && a.applicant.email.toLowerCase() === uEmail))) ||
      (a.personalInfo && a.personalInfo.fullName && a.personalInfo.fullName.toLowerCase() === uName) ||
      (a.contactInfo && a.contactInfo.email && a.contactInfo.email.toLowerCase() === uEmail)
    );
  }

  if (!app) {
    app = apps[0];
  }

  if (app) {
    app.status = 'SUBMITTED';
    app.submittedByUser = true;
    app.paymentStatus = 'PAID';
    app.submittedAt = new Date().toISOString();

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
    applicantId: INITIAL_APPLICATIONS[0].applicant,
    candidateName: INITIAL_APPLICATIONS[0].applicant.name,
    personalInfo: INITIAL_APPLICATIONS[0].personalInfo,
    application: INITIAL_APPLICATIONS[0]._id,
    applicationId: INITIAL_APPLICATIONS[0],
    applicationNumber: 'IEM-2026-1000',
    examName: 'IEMJEE 2026',
    rollNumber: 'IEMJEE-2026-1000',
    admitCardNumber: 'IEMJEE-2026-1000',
    examDate: '2026-05-15',
    marks: 96,
    score: 96,
    rank: 98,
    examStatus: 'COMPLETED'
  },
  {
    _id: 'exam-02',
    applicant: INITIAL_APPLICATIONS[1].applicant,
    applicantId: INITIAL_APPLICATIONS[1].applicant,
    candidateName: INITIAL_APPLICATIONS[1].applicant.name,
    personalInfo: INITIAL_APPLICATIONS[1].personalInfo,
    application: INITIAL_APPLICATIONS[1]._id,
    applicationId: INITIAL_APPLICATIONS[1],
    applicationNumber: 'IEM-2026-1001',
    examName: 'IEMJEE 2026',
    rollNumber: 'IEMJEE-2026-908123',
    admitCardNumber: 'IEMJEE-2026-908123',
    examDate: '2026-05-15',
    marks: 94,
    score: 94,
    rank: 142,
    examStatus: 'COMPLETED'
  }
];

export const getStoredExams = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('iem_exams');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored exams:', e);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_exams', JSON.stringify(DEMO_EXAMS));
  }
  return [...DEMO_EXAMS];
};

export const saveStoredExams = (exams) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_exams', JSON.stringify(exams));
  }
  return exams;
};

export const DEMO_ALLOCATIONS = [
  {
    _id: 'alloc-01',
    applicationId: INITIAL_APPLICATIONS[1],
    applicantId: INITIAL_APPLICATIONS[1].applicant,
    candidateName: 'Rohan Sharma',
    applicationNumber: 'IEM-2026-1001',
    courseId: INITIAL_COURSES[0],
    allocatedCourse: INITIAL_COURSES[0],
    department: 'Computer Science & Engineering',
    program: 'B.Tech Computer Science & Engineering',
    round: 1,
    seatStatus: 'PROVISIONALLY_ALLOCATED',
    allocationDate: '2026-11-16T10:00:00.000Z',
    remarks: 'Candidate selected B.Tech CSE as 1st preference and confirmed admission.'
  },
  {
    _id: 'alloc-02',
    applicationId: INITIAL_APPLICATIONS[2],
    applicantId: INITIAL_APPLICATIONS[2].applicant,
    candidateName: 'Ananya Sen',
    applicationNumber: 'IEM-2026-1002',
    courseId: INITIAL_COURSES[1],
    allocatedCourse: INITIAL_COURSES[1],
    department: 'Information Technology',
    program: 'B.Tech Information Technology',
    round: 1,
    seatStatus: 'PROVISIONALLY_ALLOCATED',
    allocationDate: '2026-11-18T10:00:00.000Z',
    remarks: 'Merit Quota Allocation'
  }
];

let memoryAllocations = null;

export const getStoredAllocations = () => {
  let allocations = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('iem_allocations');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) allocations = parsed;
      }
    } else if (memoryAllocations) {
      allocations = [...memoryAllocations];
    }
  } catch (e) {
    console.warn('Error reading stored allocations:', e);
  }

  if (!allocations || allocations.length === 0) {
    allocations = [...DEMO_ALLOCATIONS];
  }

  // Automatic synchronization:
  // Any application in getStoredApplications with status === 'ALLOCATED' MUST appear in allocations!
  let apps = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const rawApps = localStorage.getItem('iem_applications');
      if (rawApps) apps = JSON.parse(rawApps);
    }
  } catch {}
  if (!apps || apps.length === 0) apps = INITIAL_APPLICATIONS;

  const courses = [...INITIAL_COURSES];

  apps.forEach((app) => {
    if (app.status === 'ALLOCATED') {
      const exists = allocations.some(
        (al) =>
          al.applicationNumber === app.applicationNumber ||
          al.applicationId?.applicationNumber === app.applicationNumber ||
          (al.applicationId?._id && al.applicationId._id === app._id)
      );

      if (!exists) {
        const targetCourse =
          courses.find(
            (c) =>
              c._id === app.courseSelection?.courseId ||
              c.programName.toLowerCase() === (app.courseSelection?.program || '').toLowerCase()
          ) || courses[0];

        allocations.unshift({
          _id: 'alloc-' + (app._id || Date.now()),
          applicationId: app,
          applicantId: app.applicant,
          candidateName: app.personalInfo?.fullName || app.applicant?.name || 'Candidate',
          applicationNumber: app.applicationNumber,
          courseId: targetCourse,
          allocatedCourse: targetCourse,
          department: targetCourse?.department || app.courseSelection?.department || 'Engineering',
          program: targetCourse?.programName || app.courseSelection?.program || 'B.Tech Program',
          round: 1,
          seatStatus: 'PROVISIONALLY_ALLOCATED',
          allocationDate: new Date().toISOString(),
          remarks: 'Confirmed seat allotment upon document verification.'
        });
      }
    }
  });

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_allocations', JSON.stringify(allocations));
  } else {
    memoryAllocations = allocations;
  }
  return allocations;
};

export const saveStoredAllocations = (allocations) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('iem_allocations', JSON.stringify(allocations));
  }
  memoryAllocations = allocations;
  return allocations;
};

// Document HTML and URL generator for previewing uploaded documents
export const generateDocumentPreview = (doc, app) => {
  const candidateName =
    app?.personalInfo?.fullName ||
    app?.applicant?.name ||
    'Arkajit Bhattacharya';
  const appNo = app?.applicationNumber || 'IEM-2026-1000';
  const docType = doc?.documentType || '10th_Marksheet';
  const docLabel = docType.replace(/_/g, ' ');
  const fileName = doc?.originalFileName || `${docType.toLowerCase()}.pdf`;
  const is10th = docType.toLowerCase().includes('10');
  const is12th = docType.toLowerCase().includes('12');
  const isId = docType.toLowerCase().includes('id');
  const board = is10th
    ? app?.academicInfo?.tenthBoard || 'CBSE'
    : app?.academicInfo?.twelfthBoard || 'CBSE';
  const school = is10th
    ? app?.academicInfo?.tenthSchool || 'Delhi Public School'
    : app?.academicInfo?.twelfthSchool || 'Delhi Public School';
  const year = is10th
    ? app?.academicInfo?.tenthYear || 2022
    : app?.academicInfo?.twelfthYear || 2024;
  const pct = is10th
    ? app?.academicInfo?.tenthPercentage || 92.5
    : app?.academicInfo?.twelfthPercentage || 89.4;
  const verificationStatus = doc?.verificationStatus || 'VERIFIED';
  const isVerified = String(verificationStatus).toUpperCase() === 'VERIFIED';

  if (doc?.dataUrl && typeof doc.dataUrl === 'string' && doc.dataUrl.startsWith('data:')) {
    if (doc.dataUrl.startsWith('data:image/')) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName} - Official Document Viewer</title>
  <style>
    body { margin: 0; background: #0f172a; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; height: 100vh; }
    .toolbar { background: #1e293b; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; color: white; border-bottom: 1px solid #334155; }
    .btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; text-decoration: none; }
    .btn-close { background: #475569; margin-left: 8px; }
    .preview { flex: 1; display: flex; justify-content: center; align-items: center; padding: 24px; overflow: auto; }
    img { max-width: 90%; max-height: 85vh; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); background: white; }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>${docLabel}</strong> <span style="opacity:0.7">(${fileName})</span></div>
    <div>
      <button class="btn" onclick="window.print()">🖨️ Print Document</button>
      <button class="btn btn-close" onclick="window.close()">✖ Close Window</button>
    </div>
  </div>
  <div class="preview">
    <img src="${doc.dataUrl}" alt="${fileName}" />
  </div>
</body>
</html>`;
      let url = doc.dataUrl;
      try {
        if (typeof URL !== 'undefined' && typeof Blob !== 'undefined') {
          const blob = new Blob([html], { type: 'text/html' });
          url = URL.createObjectURL(blob);
        }
      } catch {}
      return { url, html };
    }
  }

  // Official Certificate / Marksheet HTML
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName} - ${candidateName}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px 16px;
      background: #f1f5f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .action-bar {
      max-width: 820px;
      width: 100%;
      background: #1e293b;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .action-bar button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-left: 8px;
    }
    .action-bar button.close-btn { background: #475569; }
    .doc-page {
      max-width: 820px;
      width: 100%;
      background: #ffffff;
      border: 3px double #1e3a8a;
      padding: 36px 42px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 64px;
      font-weight: 900;
      color: rgba(30, 58, 138, 0.05);
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .iem-logo-badge {
      display: inline-block;
      background: #1e3a8a;
      color: #ffffff;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 12px;
      border-radius: 4px;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }
    .org-title {
      font-size: 20px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      margin: 4px 0;
      text-transform: uppercase;
    }
    .sub-org {
      font-size: 13px;
      color: #475569;
      font-weight: 600;
    }
    .doc-title-badge {
      display: inline-block;
      margin-top: 14px;
      padding: 6px 18px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      border-radius: 20px;
      text-transform: uppercase;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
      margin-bottom: 24px;
      background: #f8fafc;
      padding: 16px 20px;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
    }
    .info-row { font-size: 13px; line-height: 1.5; }
    .info-label { color: #64748b; font-weight: 600; display: inline-block; width: 140px; }
    .info-value { color: #0f172a; font-weight: 700; }
    .marks-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .marks-table th, .marks-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    .marks-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
    }
    .marks-table .center { text-align: center; }
    .footer-seal {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px dashed #cbd5e1;
      padding-top: 16px;
    }
    .seal-box {
      border: 2px solid ${isVerified ? '#16a34a' : '#d97706'};
      color: ${isVerified ? '#16a34a' : '#d97706'};
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 800;
      text-align: center;
      letter-spacing: 1px;
      text-transform: uppercase;
      transform: rotate(-3deg);
    }
    .sig-block {
      text-align: center;
      font-size: 12px;
      color: #475569;
    }
    .sig-line {
      width: 160px;
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .action-bar { display: none; }
      .doc-page { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <div><strong>📄 Document Viewer:</strong> ${fileName}</div>
    <div>
      <button onclick="window.print()">🖨️ Print / Save PDF</button>
      <button class="close-btn" onclick="window.close()">✖ Close Tab</button>
    </div>
  </div>

  <div class="doc-page">
    <div class="watermark">IEM ADMISSION 2026</div>

    <div class="header">
      <div class="iem-logo-badge">IEM KOLKATA</div>
      <div class="org-title">Institute of Engineering & Management</div>
      <div class="sub-org">Office of Academic Records & Admissions Committee</div>
      <div><span class="doc-title-badge">${is10th ? 'Secondary School Examination (Class X) Statement of Marks' : (is12th ? 'Senior School Certificate Examination (Class XII) Statement of Marks' : (isId ? 'Official Government Identity Proof Verification Record' : 'Official Academic Dossier & Certificate'))}</span></div>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">Candidate Name:</span> <span class="info-value">${candidateName}</span></div>
      <div class="info-row"><span class="info-label">Application No:</span> <span class="info-value">${appNo}</span></div>
      <div class="info-row"><span class="info-label">Board / Council:</span> <span class="info-value">${board}</span></div>
      <div class="info-row"><span class="info-label">Passing Year:</span> <span class="info-value">${year}</span></div>
      <div class="info-row"><span class="info-label">School / Centre:</span> <span class="info-value">${school}</span></div>
      <div class="info-row"><span class="info-label">Original File:</span> <span class="info-value">${fileName}</span></div>
    </div>

    ${is10th ? `
    <table class="marks-table">
      <thead>
        <tr>
          <th>Sub Code</th>
          <th>Subject Description</th>
          <th class="center">Max Marks</th>
          <th class="center">Marks Obtained</th>
          <th class="center">Positional Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>184</td><td>English Language & Literature</td><td class="center">100</td><td class="center">91</td><td class="center">A1</td></tr>
        <tr><td>041</td><td>Mathematics (Standard)</td><td class="center">100</td><td class="center">95</td><td class="center">A1</td></tr>
        <tr><td>086</td><td>Science (Theory & Practical)</td><td class="center">100</td><td class="center">94</td><td class="center">A1</td></tr>
        <tr><td>087</td><td>Social Science</td><td class="center">100</td><td class="center">90</td><td class="center">A2</td></tr>
        <tr><td>165</td><td>Computer Applications</td><td class="center">100</td><td class="center">98</td><td class="center">A1</td></tr>
        <tr style="background:#f8fafc; font-weight:700;">
          <td colspan="2">AGGREGATE PERCENTAGE</td>
          <td class="center">500</td>
          <td class="center">${pct}%</td>
          <td class="center">DISTINCTION (PASS)</td>
        </tr>
      </tbody>
    </table>
    ` : (is12th ? `
    <table class="marks-table">
      <thead>
        <tr>
          <th>Sub Code</th>
          <th>Subject Description</th>
          <th class="center">Max Marks</th>
          <th class="center">Marks Obtained</th>
          <th class="center">Positional Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>301</td><td>English Core</td><td class="center">100</td><td class="center">88</td><td class="center">A2</td></tr>
        <tr><td>042</td><td>Physics (Theory: 65, Pract: 28)</td><td class="center">100</td><td class="center">93</td><td class="center">A1</td></tr>
        <tr><td>043</td><td>Chemistry (Theory: 63, Pract: 28)</td><td class="center">100</td><td class="center">91</td><td class="center">A1</td></tr>
        <tr><td>041</td><td>Mathematics</td><td class="center">100</td><td class="center">96</td><td class="center">A1</td></tr>
        <tr><td>083</td><td>Computer Science (Python)</td><td class="center">100</td><td class="center">97</td><td class="center">A1</td></tr>
        <tr style="background:#f8fafc; font-weight:700;">
          <td colspan="2">AGGREGATE PERCENTAGE</td>
          <td class="center">500</td>
          <td class="center">${pct}%</td>
          <td class="center">FIRST CLASS DISTINCTION</td>
        </tr>
      </tbody>
    </table>
    ` : `
    <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; text-align: center; margin-bottom: 24px;">
      <div style="font-size: 48px; margin-bottom: 12px;">🛡️</div>
      <h3 style="margin: 0 0 8px 0; color: #1e3a8a;">Verified Official Document Proof</h3>
      <p style="margin: 0; color: #64748b; font-size: 13px;">File: <strong>${fileName}</strong> (${doc?.fileSize || '1.2 MB'}) has been securely uploaded and authenticated.</p>
    </div>
    `)}

    <div class="footer-seal">
      <div class="seal-box">
        ✓ ${verificationStatus}<br>
        <span style="font-size: 9px; font-weight: 500;">IEM ADMISSIONS CELL</span>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <strong>Controller of Examinations</strong><br>
        <span>Institute of Engineering & Management</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  let url = 'about:blank';
  try {
    if (typeof URL !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([html], { type: 'text/html' });
      url = URL.createObjectURL(blob);
    }
  } catch {}

  return { url, html };
};
