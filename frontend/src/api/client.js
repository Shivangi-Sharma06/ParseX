import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '/api';

let hasShownSessionToast = false;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthLoginRequest = requestUrl.includes('/auth/login');
    const isAuthRegisterRequest = requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthLoginRequest && !isAuthRegisterRequest) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      localStorage.removeItem('user');

      if (!hasShownSessionToast) {
        hasShownSessionToast = true;
        toast.warn('Session expired. Please log in again.');
        window.setTimeout(() => {
          hasShownSessionToast = false;
        }, 1500);
      }

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
