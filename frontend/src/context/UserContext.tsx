import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../axiosConfig';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  approved: boolean;
  profileImage?: string;
  token: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: UpdateProfileData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: File;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${API_BASE_URL}api/users`;

  // On mount, initialize user from cookie if present
  useEffect(() => {
    const cookieUser = Cookies.get('user');
    if (cookieUser) {
      try {
        setUser(JSON.parse(cookieUser));
      } catch (error) {
        Cookies.remove('user');
      }
      setLoading(false);
      return;
    }
    // fallback to localStorage for backward compatibility
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);

  // Register user
  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      setUser(response.data);
      Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      setUser(response.data);
      Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    Cookies.remove('user');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateUserProfile = async (userData: UpdateProfileData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Create form data if profile image is included
      const formData = new FormData();
      if (userData.name) formData.append('name', userData.name);
      if (userData.email) formData.append('email', userData.email);
      if (userData.password) formData.append('password', userData.password);
      if (userData.profileImage) formData.append('profileImage', userData.profileImage);

      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw new Error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserContext;