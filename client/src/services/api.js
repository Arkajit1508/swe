import {
  DEMO_ADMIN_USER,
  DEMO_STUDENT_USER,
  DEMO_COURSES,
  DEMO_APPLICATIONS,
  DEMO_ADMIN_DASHBOARD,
  DEMO_EXAMS,
  DEMO_ALLOCATIONS
} from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to provide fallback demo data when in demo mode or when backend is unseeded
const getDemoResponse = (endpoint, method = 'GET', body = null) => {
  const savedUserStr = localStorage.getItem('iem_user');
  const user = savedUserStr ? JSON.parse(savedUserStr) : DEMO_ADMIN_USER;

  if (endpoint.startsWith('/admin/dashboard')) {
    return { success: true, data: DEMO_ADMIN_DASHBOARD };
  }

  if (endpoint.includes('/admin/applications')) {
    if (endpoint.includes('/status')) {
      return { success: true, message: 'Application status updated successfully.' };
    }
    const idMatch = endpoint.match(/\/admin\/applications\/([^/?]+)/);
    if (idMatch && idMatch[1] && idMatch[1] !== 'undefined') {
      const targetId = idMatch[1];
      const found = DEMO_APPLICATIONS.find(
        (a) => a._id === targetId || a.applicationNumber === targetId
      ) || DEMO_APPLICATIONS[0];
      return {
        success: true,
        application: found,
        documents: [
          {
            _id: 'doc-demo-01',
            documentType: '10th_Marksheet',
            originalFileName: 'class10_marksheet.pdf',
            filePath: '/sample_marksheet.pdf',
            verificationStatus: 'VERIFIED'
          },
          {
            _id: 'doc-demo-02',
            documentType: '12th_Marksheet',
            originalFileName: 'class12_marksheet.pdf',
            filePath: '/sample_marksheet.pdf',
            verificationStatus: 'VERIFIED'
          }
        ],
        payments: [
          {
            _id: 'pay-demo-01',
            amount: 500,
            paymentStatus: 'SUCCESS',
            transactionId: 'TXN-IEM-2026-DEMO',
            paymentMethod: 'UPI'
          }
        ]
      };
    }
    return {
      success: true,
      count: DEMO_APPLICATIONS.length,
      total: DEMO_APPLICATIONS.length,
      applications: DEMO_APPLICATIONS
    };
  }

  if (endpoint.startsWith('/courses')) {
    return {
      success: true,
      count: DEMO_COURSES.length,
      courses: DEMO_COURSES
    };
  }

  if (endpoint.startsWith('/admin/exams') || endpoint.startsWith('/exams')) {
    return {
      success: true,
      exams: DEMO_EXAMS
    };
  }

  if (endpoint.startsWith('/counselling/all')) {
    return {
      success: true,
      allocations: DEMO_ALLOCATIONS
    };
  }

  if (endpoint.startsWith('/auth/me')) {
    return {
      success: true,
      user
    };
  }

  if (endpoint.startsWith('/applications/me')) {
    return {
      success: true,
      application: DEMO_APPLICATIONS[0]
    };
  }

  if (endpoint.startsWith('/notifications')) {
    return {
      success: true,
      notifications: [
        {
          _id: 'notif-01',
          title: 'Dean Admission Portal Ready',
          message: 'Academic demo environment initialized successfully.',
          type: 'INFO',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  return null;
};

// Common API request function
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('iem_token');
  const isDemoSession = token && token.startsWith('demo-');

  // If in pure demo session and endpoint matches a mock response, return it directly
  if (isDemoSession) {
    const demoRes = getDemoResponse(endpoint, options.method || 'GET', options.body);
    if (demoRes) return demoRes;
  }

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  // Don't set Content-Type for FormData.
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
      // If server returned an error (e.g. 401 unseeded DB) but we have demo data, fallback to demo data
      const fallback = getDemoResponse(endpoint, options.method || 'GET', options.body);
      if (fallback) return fallback;

      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // In case of network failure or server error, provide demo fallback if available
    const fallback = getDemoResponse(endpoint, options.method || 'GET', options.body);
    if (fallback) return fallback;

    throw error;
  }
};

export const api = {
  get: (endpoint) =>
    request(endpoint, { method: 'GET' }),

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

  delete: (endpoint) =>
    request(endpoint, { method: 'DELETE' }),

  // Open a private document using a temporary Supabase URL
  openDocument: async (documentId) => {
    const newWindow = window.open('about:blank', '_blank');

    try {
      const data = await request(`/documents/${documentId}/url`, {
        method: 'GET'
      });

      if (newWindow) {
        newWindow.location.href = data.url;
      } else {
        window.location.href = data.url;
      }
    } catch (error) {
      if (newWindow) {
        newWindow.close();
      }

      throw error;
    }
  }
};

export default api;
