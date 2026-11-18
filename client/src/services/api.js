import {
  DEMO_ADMIN_USER,
  DEMO_STUDENT_USER,
  INITIAL_COURSES,
  DEMO_EXAMS,
  DEMO_ALLOCATIONS,
  getStoredCourses,
  saveStoredCourses,
  decrementCourseSeat,
  getStoredApplications,
  saveStoredApplications,
  getRegisteredUsers,
  addRegisteredUser,
  getStoredAllocations,
  saveStoredAllocations,
  getApplicationForUser,
  saveOrUpdateApplication,
  submitStudentApplication,
  getDashboardStatsFromStored
} from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iem-admission-api.onrender.com/api';

// Intercept / handle responses locally so registered candidates and seat decrements persist immediately
const handleAppLogic = (endpoint, method = 'GET', body = null) => {
  let parsedBody = body;
  if (typeof body === 'string') {
    try {
      parsedBody = JSON.parse(body);
    } catch {}
  }
  const savedUserStr = localStorage.getItem('iem_user');
  const user = savedUserStr ? JSON.parse(savedUserStr) : DEMO_ADMIN_USER;

  // 1. COURSES & SEAT AVAILABILITY
  if (endpoint.startsWith('/courses')) {
    if (method === 'PUT') {
      const match = endpoint.match(/\/courses\/([^/?]+)/);
      const courseId = match ? match[1] : null;
      const courses = getStoredCourses();
      const idx = courses.findIndex((c) => c._id === courseId);
      if (idx >= 0 && parsedBody) {
        courses[idx] = { ...courses[idx], ...parsedBody };
        saveStoredCourses(courses);
        return { success: true, course: courses[idx] };
      }
    }
    const courses = getStoredCourses();
    return {
      success: true,
      count: courses.length,
      courses
    };
  }

  // 2. STUDENT APPLICATION PROFILE
  if (endpoint.startsWith('/applications/me')) {
    const app = getApplicationForUser(user);
    return {
      success: true,
      application: app,
      documents: app?.documents || [
        {
          _id: 'doc-01',
          documentType: '10th_Marksheet',
          originalFileName: 'class10_marksheet.pdf',
          fileSize: '1.2 MB',
          verificationStatus: 'PENDING'
        },
        {
          _id: 'doc-02',
          documentType: '12th_Marksheet',
          originalFileName: 'class12_marksheet.pdf',
          fileSize: '1.4 MB',
          verificationStatus: 'PENDING'
        }
      ],
      payment: {
        paymentStatus: app?.paymentStatus || 'PAID',
        amount: 500
      }
    };
  }

  // 3. APPLICATION DRAFT SAVE
  if (endpoint === '/applications/draft' && method === 'POST') {
    const saved = saveOrUpdateApplication(body || {}, user);
    return {
      success: true,
      message: 'Draft saved successfully',
      application: saved
    };
  }

  // 4. APPLICATION SUBMIT & SEAT REDUCTION
  if (endpoint.includes('/submit') && method === 'POST') {
    const idMatch = endpoint.match(/\/applications\/([^/?]+)\/submit/);
    const appId = idMatch ? idMatch[1] : null;
    const submitted = submitStudentApplication(appId, user);
    return {
      success: true,
      message: 'Application submitted successfully!',
      application: submitted
    };
  }

  // 5. ADMIN APPLICATIONS LIST (includes newly registered applicants)
  if (endpoint.startsWith('/admin/applications')) {
    // Status update check
    if (endpoint.includes('/status') && method === 'PUT') {
      const idMatch = endpoint.match(/\/admin\/applications\/([^/?]+)\/status/);
      const targetId = idMatch ? idMatch[1] : null;
      const apps = getStoredApplications();
      const app = apps.find((a) => a._id === targetId || a.applicationNumber === targetId);
      if (app) {
        const prevStatus = app.status;
        app.status = parsedBody?.status || app.status;
        if (parsedBody?.rejectionReason) {
          app.rejectionReason = parsedBody.rejectionReason;
        }
        // If transitioning to ALLOCATED and wasn't allocated before, decrement seat
        if (app.status === 'ALLOCATED' && prevStatus !== 'ALLOCATED') {
          decrementCourseSeat(app.courseSelection?.courseId || app.courseSelection?.program);
        }
        saveStoredApplications(apps);
      }
      return { success: true, message: 'Status updated successfully', application: app };
    }

    // Single applicant dossier inspection
    const idMatch = endpoint.match(/\/admin\/applications\/([^/?]+)/);
    if (idMatch && idMatch[1] && idMatch[1] !== 'undefined') {
      const targetId = idMatch[1];
      const apps = getStoredApplications();
      const found = apps.find((a) => a._id === targetId || a.applicationNumber === targetId) || apps[0];
      return {
        success: true,
        application: found,
        documents: found.documents?.length > 0 ? found.documents : [
          {
            _id: 'doc-01',
            documentType: '10th_Marksheet',
            originalFileName: `${found.personalInfo?.fullName || 'student'}_class10.pdf`,
            fileSize: '1.2 MB',
            verificationStatus: 'PENDING'
          },
          {
            _id: 'doc-02',
            documentType: '12th_Marksheet',
            originalFileName: `${found.personalInfo?.fullName || 'student'}_class12.pdf`,
            fileSize: '1.4 MB',
            verificationStatus: 'PENDING'
          }
        ],
        payments: [
          {
            _id: 'pay-01',
            amount: 500,
            paymentStatus: found.paymentStatus || 'PAID',
            transactionId: 'TXN-IEM-2026-' + (found.applicationNumber || 'DEMO'),
            paymentMethod: 'UPI / NetBanking'
          }
        ]
      };
    }

    // Full list with filters
    let apps = getStoredApplications();
    const url = new URL(`http://dummy.com${endpoint}`);
    const statusFilter = url.searchParams.get('status');
    const deptFilter = url.searchParams.get('department');
    const search = url.searchParams.get('search')?.toLowerCase();

    if (statusFilter && statusFilter !== 'ALL') {
      apps = apps.filter((a) => a.status === statusFilter);
    }
    if (deptFilter && deptFilter !== 'ALL') {
      apps = apps.filter((a) => a.courseSelection?.department === deptFilter);
    }
    if (search) {
      apps = apps.filter(
        (a) =>
          a.applicationNumber?.toLowerCase().includes(search) ||
          a.personalInfo?.fullName?.toLowerCase().includes(search) ||
          a.applicant?.name?.toLowerCase().includes(search) ||
          a.contactInfo?.email?.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      count: apps.length,
      total: apps.length,
      applications: apps
    };
  }

  // 6. ADMIN DASHBOARD ANALYTICS
  if (endpoint.startsWith('/admin/dashboard')) {
    return {
      success: true,
      data: getDashboardStatsFromStored()
    };
  }

  // 7. COUNSELLING ALLOCATION & SEAT REDUCTION
  if (endpoint.includes('/counselling/allocate') && method === 'POST') {
    const { applicationId, courseId, round, remarks, seatStatus } = parsedBody || {};
    const apps = getStoredApplications();
    const app = apps.find((a) => a._id === applicationId || a.applicationNumber === applicationId);
    if (app) {
      app.status = 'ALLOCATED';
      saveStoredApplications(apps);
    }

    // Decrement course seat
    const courses = getStoredCourses();
    const targetCourse =
      courses.find((c) => c._id === courseId || c.programName === courseId) || courses[0];
    if (targetCourse) {
      decrementCourseSeat(targetCourse._id);
    }

    // Save allocation record
    const allocations = getStoredAllocations();
    const newAllocation = {
      _id: 'alloc-' + Date.now(),
      applicationId: app,
      applicantId: app?.applicant,
      courseId: targetCourse,
      allocatedCourse: targetCourse,
      department: targetCourse?.department || 'Computer Science & Engineering',
      program: targetCourse?.programName || 'B.Tech Program',
      round: round || 1,
      seatStatus: seatStatus || 'CONFIRMED',
      allocationDate: new Date().toISOString(),
      remarks: remarks || 'Merit Quota Allocation'
    };
    allocations.unshift(newAllocation);
    saveStoredAllocations(allocations);

    return {
      success: true,
      message: 'A seat has been allocated successfully!',
      allocation: newAllocation
    };
  }

  if (endpoint.startsWith('/counselling/all')) {
    return {
      success: true,
      allocations: getStoredAllocations()
    };
  }

  // 8. DOCUMENT VERIFICATION ACTION
  if (endpoint.includes('/documents') && endpoint.includes('/verify') && method === 'PUT') {
    const idMatch = endpoint.match(/\/documents\/([^/?]+)\/verify/);
    const docId = idMatch ? idMatch[1] : null;
    const apps = getStoredApplications();
    apps.forEach((a) => {
      if (a.documents) {
        const doc = a.documents.find((d) => d._id === docId);
        if (doc) {
          doc.verificationStatus = parsedBody?.verificationStatus || 'VERIFIED';
          doc.remarks = parsedBody?.remarks || '';
        }
      }
    });
    saveStoredApplications(apps);
    return {
      success: true,
      message: 'Document verification updated successfully'
    };
  }

  // 9. DOCUMENT UPLOAD
  if (endpoint === '/documents/upload' && method === 'POST') {
    const apps = getStoredApplications();
    const app = getApplicationForUser(user);
    if (app) {
      if (!app.documents) app.documents = [];
      const newDoc = {
        _id: `doc-${Date.now()}`,
        documentType: 'Marksheet / Certificate',
        originalFileName: 'uploaded_document.pdf',
        fileSize: '1.1 MB',
        verificationStatus: 'PENDING',
        uploadedAt: new Date().toISOString()
      };
      app.documents.push(newDoc);
      saveStoredApplications(apps);
    }
    return {
      success: true,
      message: 'Document uploaded successfully'
    };
  }

  // 10. MOCK PAYMENT & PAYMENT STATUS
  if (endpoint.startsWith('/payments/mock') && method === 'POST') {
    const apps = getStoredApplications();
    const app = getApplicationForUser(user);
    if (app) {
      app.paymentStatus = 'PAID';
      saveStoredApplications(apps);
    }
    return {
      success: true,
      message: 'Payment of ₹500 recorded successfully',
      payment: {
        _id: `pay-${Date.now()}`,
        amount: 500,
        paymentStatus: 'SUCCESS',
        transactionId: `TXN-IEM-${Date.now()}`
      }
    };
  }

  if (endpoint.startsWith('/payments') && method === 'GET') {
    const app = getApplicationForUser(user);
    return {
      success: true,
      payment: {
        _id: 'pay-01',
        amount: 500,
        paymentStatus: app?.paymentStatus || 'PAID',
        transactionId: 'TXN-IEM-2026-ONLINE',
        paymentMethod: 'UPI'
      }
    };
  }

  if (endpoint.startsWith('/documents/application') && method === 'GET') {
    const app = getApplicationForUser(user);
    return {
      success: true,
      documents: app?.documents || []
    };
  }

  if (endpoint.startsWith('/admin/exams') || endpoint.startsWith('/exams')) {
    return {
      success: true,
      exams: DEMO_EXAMS
    };
  }

  if (endpoint.startsWith('/notifications')) {
    if (method === 'PUT') {
      return { success: true, message: 'Notification marked as read' };
    }
    return {
      success: true,
      count: 2,
      notifications: [
        {
          _id: 'notif-01',
          title: 'Application Submitted & Recorded',
          message: 'Your admission dossier has been received and queued for committee verification.',
          type: 'SUCCESS',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'notif-02',
          title: 'Application Fee Confirmed',
          message: 'Application fee of ₹500 confirmed via online transaction.',
          type: 'INFO',
          isRead: true,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  if (endpoint.startsWith('/counselling/me')) {
    const app = getApplicationForUser(user);
    const allocations = getStoredAllocations();
    const userAlloc = allocations.find(
      (al) =>
        (app && (al.applicationId?._id === app._id || al.applicationId?.applicationNumber === app.applicationNumber)) ||
        (user && (al.applicantId?._id === user._id || al.applicantId?.email === user.email))
    );

    return {
      success: true,
      allocation: userAlloc || {
        _id: 'alloc-me',
        applicationId: app,
        courseId: {
          programName: app?.courseSelection?.program || 'B.Tech Computer Science & Engineering',
          department: app?.courseSelection?.department || 'Computer Science & Engineering'
        },
        seatStatus: 'PROVISIONALLY_ALLOCATED',
        round: 1
      }
    };
  }

  if (endpoint.startsWith('/auth/register') && method === 'POST') {
    const newUser = addRegisteredUser(parsedBody);
    return {
      success: true,
      token: 'token-reg-' + Date.now(),
      user: newUser
    };
  }

  if (endpoint.startsWith('/auth/me')) {
    return {
      success: true,
      user
    };
  }

  return null;
};

// Common API request function
const request = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const token = localStorage.getItem('iem_token');
  const isDemoSession = !token || token.startsWith('demo-');

  // Handle local synchronous store first for responsive seats and applications
  const localHandled = handleAppLogic(endpoint, method, options.body);
  if (localHandled) {
    // If backend is active, also asynchronously attempt to update the backend
    if (!isDemoSession && method !== 'GET') {
      try {
        const headers = { Accept: 'application/json', ...options.headers };
        if (!(options.body instanceof FormData) && options.body !== undefined) {
          headers['Content-Type'] = 'application/json';
        }
        if (token) headers.Authorization = `Bearer ${token}`;
        fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers }).catch(() => {});
      } catch {}
    }
    return localHandled;
  }

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response received from server.');
    }

    if (!response.ok) {
      const fallback = handleAppLogic(endpoint, method, options.body);
      if (fallback) return fallback;
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    const fallback = handleAppLogic(endpoint, method, options.body);
    if (fallback) return fallback;
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  openDocument: async (documentId) => {
    const newWindow = window.open('about:blank', '_blank');
    try {
      const data = await request(`/documents/${documentId}/url`, { method: 'GET' });
      if (newWindow) newWindow.location.href = data.url;
      else window.location.href = data.url;
    } catch (error) {
      if (newWindow) newWindow.close();
      throw error;
    }
  }
};

export default api;
