import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface Webinar {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  speaker: {
    _id: string | null;
    name: string;
    email: string;
    profileImage?: string;
    role?: string;
    company?: string;
    experience?: string;
    bio?: string;
    expertise?: string[];
  };
  startTime: string;
  endTime: string; // <-- add endTime
  duration: number;
  price: number; // <-- add price
  zoomUrl?: string; // <-- add zoomUrl
  link?: string; // keep for backward compatibility
  attendees: string[];
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  maxAttendees?: number;
  learningOutcomes?: string[];
  prerequisites?: string[];
  agenda?: { time: string; topic: string; description: string }[];
  resources?: { name: string; type: string; url: string }[];
  language?: string;
  level?: string;
  speakerBio?: string;
  speakerExpertise?: string[];
  speakerRole?: string;
  speakerCompany?: string;
  speakerExperience?: string;
  category?: string;
  tags?: string[];
}

interface WebinarState {
  webinars: Webinar[];
  webinar: Webinar | null;
  loading: boolean;
  error: string | null;
  registrationStatus: Record<string, boolean>; // webinarId -> registered
}

const initialState: WebinarState = {
  webinars: [],
  webinar: null,
  loading: false,
  error: null,
  registrationStatus: {},
};

export const fetchWebinars = createAsyncThunk(
  'webinars/fetchWebinars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/webinars');
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch webinars');
    }
  }
);

export const fetchWebinarById = createAsyncThunk(
  'webinars/fetchWebinarById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/webinars/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch webinar');
    }
  }
);

export const createWebinar = createAsyncThunk(
  'webinars/createWebinar',
  async (webinarData: Partial<Webinar>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/webinars', webinarData);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to create webinar');
    }
  }
);

export const updateWebinar = createAsyncThunk(
  'webinars/updateWebinar',
  async ({ id, webinarData }: { id: string; webinarData: Partial<Webinar> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/webinars/${id}`, webinarData);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to update webinar');
    }
  }
);

export const deleteWebinar = createAsyncThunk(
  'webinars/deleteWebinar',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/webinars/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to delete webinar');
    }
  }
);

// Register for Webinar (update to return { id, registered })
export const registerForWebinar = createAsyncThunk(
  'webinars/registerForWebinar',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/webinars/register/${id}`);
      // Assume backend returns updated webinar and registration status
      return { id, webinar: response.data, registered: true };
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to register for webinar');
    }
  }
);

// Add thunk to check registration status (already present, just ensure consistent return)
export const checkWebinarRegistration = createAsyncThunk(
  'webinars/checkWebinarRegistration',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/webinars/${id}/is-registered`);
      return { id, registered: response.data.registered };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return rejectWithValue((error.response.data as { message?: string }).message || 'Failed to check registration');
      }
      return rejectWithValue('Failed to check registration');
    }
  }
);

const webinarSlice = createSlice({
  name: 'webinars',
  initialState,
  reducers: {
    clearWebinar: (state) => {
      state.webinar = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationStatus: (state, action) => {
      const { id, registered } = action.payload;
      state.registrationStatus[id] = registered;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Webinars
      .addCase(fetchWebinars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebinars.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = action.payload;
      })
      .addCase(fetchWebinars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Webinar by ID
      .addCase(fetchWebinarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebinarById.fulfilled, (state, action) => {
        state.loading = false;
        state.webinar = action.payload;
      })
      .addCase(fetchWebinarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Webinar
      .addCase(createWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars.unshift(action.payload);
      })
      .addCase(createWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Webinar
      .addCase(updateWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = state.webinars.map((webinar) =>
          webinar._id === action.payload._id ? action.payload : webinar
        );
        state.webinar = action.payload;
      })
      .addCase(updateWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Webinar
      .addCase(deleteWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = state.webinars.filter((webinar) => webinar._id !== action.payload);
        if (state.webinar?._id === action.payload) {
          state.webinar = null;
        }
      })
      .addCase(deleteWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register for Webinar
      .addCase(registerForWebinar.fulfilled, (state, action) => {
        const { id, webinar, registered } = action.payload;
        state.webinars = state.webinars.map((w) =>
          w._id === id ? webinar : w
        );
        if (state.webinar?._id === id) {
          state.webinar = webinar;
        }
        // Mark as registered
        if (id) {
          state.registrationStatus[id] = registered;
        }
      })
      // Check Webinar Registration
      .addCase(checkWebinarRegistration.fulfilled, (state, action) => {
        state.registrationStatus[action.payload.id] = action.payload.registered;
      });
  },
});

export const { clearWebinar, clearError, setRegistrationStatus } = webinarSlice.actions;
export default webinarSlice.reducer;