import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Backend server URL
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
  } catch (e) {
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
      } catch (e) {
        // Invalid cookie, ignore
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
