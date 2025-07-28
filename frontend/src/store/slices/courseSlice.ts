import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfig";

interface Lesson {
  description: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  video?: string;
  unlocked?: boolean;
}

interface Course {
  level: string;
  originalPrice: number;
  learningObjectives: any;
  prerequisites: any;
  instructor: any;
  enrolledStudents: any;
  rating: number;
  language: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  instructorId: string;
  lessons: Lesson[];
  thumbnail: string;
  published: boolean;
  approved: boolean;
  isEnrolled?: boolean;
  paymentStatus?: string;
}

interface CourseState {
  courses: Course[];
  course: Course | null;
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instructorData: any;
}

const initialState: CourseState = {
  courses: [],
  course: null,
  loading: false,
  error: null,
  instructorData: [],
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params: { published?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.published) {
        queryParams.append("published", params.published);
      }
      const response = await axios.get(
        `/api/courses?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch course"
      );
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: any, { rejectWithValue }) => {
    try {
      let config = {};
      // If courseData is FormData, let Axios set the headers
      if (courseData instanceof FormData) {
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const response = await axios.post("/api/courses", courseData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create course"
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (
    { id, courseData }: { id: string; courseData: Partial<Course> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update course"
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/courses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourse: (state) => {
      state.course = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInstructorsData: (s, a) => {
      s.instructorData = a.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.map((course) =>
          course._id === action.payload._id ? action.payload : course
        );
        state.course = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
        if (state.course?._id === action.payload) {
          state.course = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCourse, clearError, setInstructorsData } =
  courseSlice.actions;
export default courseSlice.reducer;

export const getInstructors = async (dispatch) => {
  try {
    const response = await axios.get("/instructors");
    console.log("instructors", response);
    dispatch(setInstructorsData(response?.data));
  } catch (error) {
    console.log("error", error);
  }
};
