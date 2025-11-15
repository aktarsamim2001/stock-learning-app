import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Backend server URL
  timeout: 10000
});

// Set up axios default Authorization header from cookie on app load
const userCookie = Cookies.get('user');
if (userCookie) {
  try {
    const user = JSON.parse(userCookie);
    if (user?.token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  } catch {
    // Invalid cookie, ignore
  }
}

// Add a request interceptor to dynamically update the token
instance.interceptors.request.use(
  (config) => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // Invalid cookie, ignore
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired/invalid tokens
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const msg = error?.response?.data?.message;
      const status = error?.response?.status;
      if (msg === 'Not authorized, token failed' || status === 401) {
        // Clear stored user information and force a full reload to the login page
        try {
          Cookies.remove('user');
        } catch {
          // ignore
        }
        try {
          localStorage.removeItem('user');
        } catch {
          // ignore
        }

        // Redirect to login. Use full navigation so the app resets.
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } catch {
      // ignore any errors while handling the response
    }

    return Promise.reject(error);
  }
);

export default instance;
