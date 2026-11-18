import {
  DEMO_ADMIN_USER,
  DEMO_STUDENT_USER,
  INITIAL_COURSES,
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
  getDashboardStatsFromStored,
  generateDocumentPreview
} from './demoData.js';

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

  // 0. AUTHENTICATION & LOGIN HANDLERS
  if (endpoint.startsWith('/auth/admin-login') && method === 'POST') {
    return {
      success: true,
      message: 'Dean / Admin login successful',
      token: 'demo-admin-token-iem-dean',
      user: DEMO_ADMIN_USER
    };
  }

  if (endpoint.startsWith('/auth/login') && method === 'POST') {
    const email = parsedBody?.email?.toLowerCase();
    if (email === 'admin@iem.edu' || email === 'dean@iem.edu') {
      return {
        success: true,
        message: 'Admin login successful',
        token: 'demo-admin-token-iem-dean',
        user: DEMO_ADMIN_USER
      };
    }
    const regUsers = getRegisteredUsers();
    const foundUser = regUsers.find((u) => u.email?.toLowerCase() === email);
    if (foundUser) {
      return {
        success: true,
        message: 'Login successful',
        token: 'token-usr-' + (foundUser.id || foundUser._id || Date.now()),
        user: foundUser
      };
    }
    if (email === 'rohan.sharma@example.com' || email === 'student@example.com') {
      return {
        success: true,
        message: 'Student login successful',
        token: 'demo-student-token-rohan',
        user: DEMO_STUDENT_USER
      };
    }
  }

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
      documents: (app?.documents && app.documents.length > 0) ? app.documents : [],
      payment: {
        paymentStatus: app?.paymentStatus || 'PENDING',
        amount: 500
      }
    };
  }

  // 3. APPLICATION DRAFT SAVE
  if (endpoint === '/applications/draft' && method === 'POST') {
    const saved = saveOrUpdateApplication(parsedBody || {}, user);
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
        documents: (found.documents && found.documents.length > 0) ? found.documents : [],
        payments: [
          {
            _id: 'pay-01',
            amount: 500,
            paymentStatus: found.paymentStatus || 'PENDING',
            transactionId: found.paymentStatus === 'PAID' ? 'TXN-IEM-2026-' + (found.applicationNumber || 'DEMO') : '',
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
      if (statusFilter === 'APPROVED') {
        const allocations = getStoredAllocations();
        const allocatedAppIds = new Set(
          allocations.map((al) => al.applicationId?._id || al.applicationNumber || al.applicationId)
        );

        apps = apps.filter(
          (a) =>
            !allocatedAppIds.has(a._id) &&
            !allocatedAppIds.has(a.applicationNumber) &&
            a.status !== 'ALLOCATED' &&
            a.status !== 'REJECTED' &&
            (
              a.status === 'APPROVED' ||
              a.status === 'DOCUMENT_VERIFIED' ||
              (a.documents &&
                a.documents.length > 0 &&
                a.documents.every((d) => String(d.verificationStatus).toUpperCase() === 'VERIFIED'))
            )
        );
      } else {
        apps = apps.filter((a) => a.status === statusFilter);
      }
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
      candidateName: app?.personalInfo?.fullName || app?.applicant?.name || 'Candidate',
      applicationNumber: app?.applicationNumber || 'IEM-2026-DEMO',
      courseId: targetCourse,
      allocatedCourse: targetCourse,
      department: targetCourse?.department || 'Computer Science & Engineering',
      program: targetCourse?.programName || 'B.Tech Program',
      round: round || 1,
      seatStatus: seatStatus || 'PROVISIONALLY_ALLOCATED',
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
    let updatedApp = null;
    apps.forEach((a) => {
      if (a.documents) {
        const doc = a.documents.find((d) => d._id === docId);
        if (doc) {
          doc.verificationStatus = parsedBody?.verificationStatus || 'VERIFIED';
          doc.remarks = parsedBody?.remarks || '';
          updatedApp = a;
        }
      }
    });

    // If all documents are verified, auto-approve application for seat counselling!
    if (updatedApp && updatedApp.documents && updatedApp.documents.length > 0) {
      const allVerified = updatedApp.documents.every(
        (d) => String(d.verificationStatus).toUpperCase() === 'VERIFIED'
      );
      if (allVerified && updatedApp.status !== 'ALLOCATED' && updatedApp.status !== 'REJECTED') {
        updatedApp.status = 'APPROVED';
      }
    }

    saveStoredApplications(apps);
    return {
      success: true,
      message: 'Document verification updated successfully',
      application: updatedApp
    };
  }

  // 8.5. DOCUMENT VIEW URL
  if (endpoint.match(/\/documents\/([^/?]+)\/url/)) {
    const match = endpoint.match(/\/documents\/([^/?]+)\/url/);
    const docId = match ? match[1] : null;
    const apps = getStoredApplications();
    let foundDoc = null;
    let foundApp = null;
    for (const a of apps) {
      if (a.documents) {
        const d = a.documents.find((doc) => doc._id === docId);
        if (d) {
          foundDoc = d;
          foundApp = a;
          break;
        }
      }
    }
    if (!foundDoc) {
      for (const a of INITIAL_APPLICATIONS) {
        if (a.documents) {
          const d = a.documents.find((doc) => doc._id === docId);
          if (d) {
            foundDoc = d;
            foundApp = a;
            break;
          }
        }
      }
    }

    const { url, html } = generateDocumentPreview(foundDoc, foundApp);
    return {
      success: true,
      url,
      html,
      document: foundDoc
    };
  }

  // 9. DOCUMENT UPLOAD & DELETE
  if (endpoint === '/documents/upload' && method === 'POST') {
    const apps = getStoredApplications();
    const targetAppId = parsedBody?.applicationId || (body instanceof FormData ? body.get('applicationId') : null);
    let app = null;
    if (targetAppId) {
      app = apps.find((a) => a._id === targetAppId || a.applicationNumber === targetAppId);
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
      if (!app.documents) app.documents = [];

      let docType = parsedBody?.documentType;
      let fileName = parsedBody?.fileName;
      let fileSize = parsedBody?.fileSize;
      let dataUrl = parsedBody?.dataUrl;

      if (body instanceof FormData) {
        docType = body.get('documentType') || docType;
        fileName = body.get('fileName') || body.get('file')?.name || fileName;
        if (body.get('file')?.size) {
          fileSize = `${Math.round(body.get('file').size / 1024)} KB`;
        }
        dataUrl = body.get('dataUrl') || dataUrl;
      }

      const nowIso = new Date().toISOString();
      const newDoc = {
        _id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        documentType: docType || '10th_Marksheet',
        originalFileName: fileName || 'uploaded_document.pdf',
        fileSize: fileSize || '1.2 MB',
        verificationStatus: 'PENDING',
        dataUrl: dataUrl || null,
        uploadedAt: nowIso,
        createdAt: nowIso
      };

      const existingIdx = app.documents.findIndex((d) => d.documentType === newDoc.documentType);
      if (existingIdx >= 0) {
        app.documents[existingIdx] = newDoc;
      } else {
        app.documents.push(newDoc);
      }

      saveStoredApplications(apps);
      return {
        success: true,
        message: 'Document uploaded successfully',
        document: newDoc
      };
    }
    return {
      success: true,
      message: 'Document uploaded successfully'
    };
  }

  if (endpoint.startsWith('/documents/') && method === 'DELETE') {
    const docId = endpoint.split('/')[2];
    const apps = getStoredApplications();
    apps.forEach((a) => {
      if (a.documents) {
        a.documents = a.documents.filter((d) => d._id !== docId);
      }
    });
    saveStoredApplications(apps);
    return {
      success: true,
      message: 'Document deleted successfully'
    };
  }

  // 10. MOCK PAYMENT & PAYMENT STATUS
  if (endpoint.startsWith('/payments/mock') && method === 'POST') {
    const apps = getStoredApplications();
    const targetAppId = parsedBody?.applicationId;
    let app = null;
    if (targetAppId) {
      app = apps.find((a) => a._id === targetAppId || a.applicationNumber === targetAppId);
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
    if (!app) app = apps[0];

    const txnId = `TXN-IEM-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const paymentRecord = {
      _id: `pay-${Date.now()}`,
      amount: 500,
      paymentStatus: 'PAID',
      transactionId: txnId,
      paymentMethod: parsedBody?.paymentMethod || 'UPI',
      paymentDate: nowIso,
      createdAt: nowIso
    };

    if (app) {
      app.paymentStatus = 'PAID';
      app.paymentDetails = paymentRecord;
      saveStoredApplications(apps);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('iem_payments', JSON.stringify(paymentRecord));
      } catch {}
    }

    return {
      success: true,
      message: 'Payment of ₹500 recorded successfully',
      payment: paymentRecord
    };
  }

  if (endpoint.startsWith('/payments') && method === 'GET') {
    const apps = getStoredApplications();
    let app = null;
    const urlMatch = endpoint.match(/\/payments\/([^/?]+)/);
    const targetAppId = urlMatch ? urlMatch[1] : null;
    if (targetAppId && targetAppId !== 'undefined') {
      app = apps.find((a) => a._id === targetAppId || a.applicationNumber === targetAppId);
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
    if (!app) app = apps[0];

    let storedPay = app?.paymentDetails;
    if (!storedPay && typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('iem_payments');
        if (raw) storedPay = JSON.parse(raw);
      } catch {}
    }

    const isPaid = app?.paymentStatus === 'PAID' || storedPay?.paymentStatus === 'PAID';
    const finalRecord = {
      _id: storedPay?._id || 'pay-01',
      amount: storedPay?.amount || 500,
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      transactionId: isPaid ? (storedPay?.transactionId || 'TXN-IEM-2026-ONLINE') : '',
      paymentMethod: storedPay?.paymentMethod || 'UPI',
      paymentDate: isPaid ? (storedPay?.paymentDate || app?.submittedAt || new Date().toISOString()) : null
    };

    return {
      success: true,
      payment: finalRecord
    };
  }

  if (endpoint.startsWith('/documents/application') && method === 'GET') {
    const urlMatch = endpoint.match(/\/documents\/application\/([^/?]+)/);
    const targetAppId = urlMatch ? urlMatch[1] : null;
    const apps = getStoredApplications();
    let app = null;
    if (targetAppId && targetAppId !== 'undefined' && targetAppId !== 'application') {
      app = apps.find((a) => a._id === targetAppId || a.applicationNumber === targetAppId);
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
    if (!app) app = apps[0];

    return {
      success: true,
      documents: (app?.documents && app.documents.length > 0) ? app.documents : []
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
        (app && (al.applicationId?._id === app._id || al.applicationNumber === app.applicationNumber || al.applicationId?.applicationNumber === app.applicationNumber)) ||
        (user && (al.candidateName === user.name || al.applicantId?._id === user.id || al.applicantId?.email === user.email))
    );

    const isAllocated = (userAlloc && (userAlloc.seatStatus === 'PROVISIONALLY_ALLOCATED' || userAlloc.seatStatus === 'CONFIRMED')) || (app && app.status === 'ALLOCATED');

    if (!isAllocated) {
      return {
        success: true,
        allocation: null
      };
    }

    const finalAlloc = userAlloc || {
      _id: 'alloc-' + (app?._id || 'me'),
      applicationId: app,
      candidateName: app?.personalInfo?.fullName || user?.name || 'Applicant',
      applicationNumber: app?.applicationNumber || 'IEM-2026-DEMO',
      courseId: {
        programName: app?.courseSelection?.program || 'B.Tech Computer Science & Engineering',
        department: app?.courseSelection?.department || 'Computer Science & Engineering',
        durationYears: 4
      },
      program: app?.courseSelection?.program || 'B.Tech Computer Science & Engineering',
      department: app?.courseSelection?.department || 'Computer Science & Engineering',
      seatStatus: 'PROVISIONALLY_ALLOCATED',
      round: 1,
      allocationDate: new Date().toISOString(),
      remarks: 'Merit Quota Allocation'
    };

    return {
      success: true,
      allocation: {
        ...finalAlloc,
        allocationDate: finalAlloc.allocationDate || new Date().toISOString(),
        courseId: {
          programName: finalAlloc.courseId?.programName || finalAlloc.program || 'B.Tech Program',
          department: finalAlloc.courseId?.department || finalAlloc.department || 'Engineering',
          durationYears: finalAlloc.courseId?.durationYears || 4
        }
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
    try {
      const data = await request(`/documents/${documentId}/url`, { method: 'GET' });
      if (data && data.url) {
        const newWindow = window.open(data.url, '_blank');
        if (!newWindow) {
          window.location.href = data.url;
        }
        return data;
      }
      throw new Error('Failed to retrieve document view URL');
    } catch (error) {
      console.error('Error opening document:', error);
      throw error;
    }
  }
};

export default api;
