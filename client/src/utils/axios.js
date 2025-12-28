import axios from 'axios';
import { store } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token (we'll implement this later)
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.token) {
          localStorage.setItem('token', data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        store.dispatch(logoutUser());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Logout if token is invalid or expired
    if (error.response?.status === 403) {
      store.dispatch(logoutUser());
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;