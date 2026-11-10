
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Common API request function
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('iem_token');

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  // Don't set Content-Type for FormData.
  // The browser automatically sets the multipart boundary.
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
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
