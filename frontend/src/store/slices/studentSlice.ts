import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    lessons: Array<{
      _id: string;
      title: string;
      duration: number;
    }>;
    instructorId: {
      name: string;
      profileImage: string;
    };
  };
  progress: number;
  completedLessons: Array<{
    lessonId: string;
    completedAt: string;
  }>;
  certificateIssued: boolean;
  certificateUrl: string;
}

interface Certificate {
  _id: string;
  courseId: {
    title: string;
  };
  certificateUrl: string;
  completedAt: string;
}

interface QuizResult {
  courseTitle: string;
  results: Array<{
    quizId: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
  }>;
}

interface StudentState {
  enrolledCourses: EnrolledCourse[];
  certificates: Certificate[];
  recommendedCourses: any[];
  quizResults: QuizResult[];
  upcomingWebinars: any[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  enrolledCourses: [],
  certificates: [],
  recommendedCourses: [],
  quizResults: [],
  upcomingWebinars: [],
  loading: false,
  error: null,
};

export const fetchEnrolledCourses = createAsyncThunk(
  'student/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/student/courses');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
  }
);

export const fetchCertificates = createAsyncThunk(
  'student/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/student/certificates');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
    }
  }
);

export const fetchRecommendedCourses = createAsyncThunk(
  'student/fetchRecommendedCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/student/recommendations');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  'student/fetchQuizResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/student/quiz-results');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz results');
    }
  }
);

export const fetchUpcomingWebinars = createAsyncThunk(
  'student/fetchUpcomingWebinars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/student/webinars');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming webinars');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Enrolled Courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Certificates
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      
      // Fetch Recommended Courses
      .addCase(fetchRecommendedCourses.fulfilled, (state, action) => {
        state.recommendedCourses = action.payload;
      })
      
      // Fetch Quiz Results
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.quizResults = action.payload;
      })
      
      // Fetch Upcoming Webinars
      .addCase(fetchUpcomingWebinars.fulfilled, (state, action) => {
        state.upcomingWebinars = action.payload;
      });
  },
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer;