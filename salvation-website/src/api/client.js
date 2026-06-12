import axios from 'axios';

/**
 * Central axios instance.
 * - baseURL points at the Vite proxy (/api), which forwards to
 *   http://localhost:5000 in development (see vite.config.js).
 * - The request interceptor attaches the stored admin token to every
 *   request that needs it (the server checks x-admin-token).
 */
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach admin token header on every request when logged in
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ms_admin_token');
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  return config;
});

export default client;
