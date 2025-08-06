import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set default Authorization if token exists at app load
const userCookie = Cookies.get('user');
if (userCookie) {
  try {
    const user = JSON.parse(userCookie);
    if (user?.token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  } catch (e) {}
}

// Interceptor to refresh token on each request
instance.interceptors.request.use(
  (config) => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
