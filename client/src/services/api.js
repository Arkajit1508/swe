// Central API service for making HTTP requests to Express server

const API_BASE_URL = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('iem_token');

  const headers = {
    ...options.headers
  };

  // If payload is not FormData, attach Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach JWT Bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If 401 Unauthorized, handle token expiration gracefully
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('iem_token');
        localStorage.removeItem('iem_user');
        window.location.href = '/login';
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
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
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
