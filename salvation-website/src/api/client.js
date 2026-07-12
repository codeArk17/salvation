import axios from 'axios';

/**
 * Central axios instance.
 * - In development: baseURL is /api (proxied by Vite to localhost:5000)
 * - In production: baseURL is VITE_API_URL (your deployed backend)
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

// Attach admin token header on every request when logged in
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ms_admin_token');
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  // Only set JSON content-type if body is plain object/string, not FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Auto-clear stale token on 401 responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ms_admin_token');
    }
    return Promise.reject(error);
  }
);

export default client;
