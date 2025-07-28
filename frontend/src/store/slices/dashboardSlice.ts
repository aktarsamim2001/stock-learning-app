import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface DashboardStats {
  totalUsers?: number;
  totalCourses?: number;
  totalInstructors?: number;
  totalStudents?: number;
  totalRevenue?: number;
  recentActivities?: Array<{
    _id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  pendingApprovals?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  courseStats?: {
    totalEnrollments: number;
    averageRating: number;
    totalRevenue: number;
    studentProgress: number;
  };
  upcomingWebinars?: Array<{
    _id: string;
    title: string;
    startTime: string;
    attendees: string[];
  }>;
}

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {},
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'dashboard/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dashboard/admin');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

export const fetchInstructorStats = createAsyncThunk(
  'dashboard/fetchInstructorStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dashboard/instructor');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch instructor stats');
    }
  }
);

export const fetchStudentStats = createAsyncThunk(
  'dashboard/fetchStudentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/dashboard/student');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.stats = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Instructor Stats
      .addCase(fetchInstructorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchInstructorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Student Stats
      .addCase(fetchStudentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStudentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStats, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;