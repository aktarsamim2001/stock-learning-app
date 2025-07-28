import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  approved: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  thumbnail: string; // Ensure this matches your course model
  instructor: { name: string; }; // Or the full instructor object if needed
  enrollmentCount: number; // Or however you track student numbers
  price: number;
  status: string;
}

interface CourseStats {
  totalCourses: number;
  pendingApproval: number;
  publishedCourses: number;
  totalRevenue: number;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
  courses?: Course[]; // Make sure this line is present and 'Course' interface is defined
}

interface RevenueData {
  _id: {
    year: number;
    month: number;
  };
  total: number;
  count: number;
}

interface AdminState {
  users: User[];
  courseStats: CourseStats | null;
  revenueData: RevenueData[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: AdminState = {
  users: [],
  courseStats: null,
  revenueData: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; role?: string; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/users', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchCourseStats = createAsyncThunk(
  'admin/fetchCourseStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/courses/stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course stats');
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'admin/fetchRevenueAnalytics',
  async (params: { startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/analytics/revenue', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue analytics');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      
      // Fetch Course Stats
      .addCase(fetchCourseStats.fulfilled, (state, action) => {
        state.courseStats = action.payload;
      })
      
      // Fetch Revenue Analytics
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueData = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;