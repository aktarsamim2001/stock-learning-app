import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for thunk arguments
interface RegisterForWebinarArgs {
  webinarId: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    institute: string;
    year: string;
  };
}
interface SubmitWebinarFeedbackArgs {
  webinarId: string;
  feedbackData: Record<string, unknown>;
}
interface WebinarRegistrationResponse {
  message: string;
  webinar?: Record<string, unknown>;
}

// Registration status check
export const checkWebinarRegistration = createAsyncThunk<
  { webinarId: string; isRegistered: boolean },
  string,
  { rejectValue: string }
>(
  'webinarRegistration/checkWebinarRegistration',
  async (webinarId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/webinars/${webinarId}/is-registered`);
      return { webinarId, isRegistered: response.data.isRegistered };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        return rejectWithValue((err.response.data as { message?: string }).message || 'Failed to check registration');
      }
      return rejectWithValue('Failed to check registration');
    }
  }
);

// Register for a webinar
export const registerForWebinar = createAsyncThunk<
  { webinarId: string; registration: WebinarRegistrationResponse },
  RegisterForWebinarArgs,
  { rejectValue: string }
>(
  'webinarRegistration/registerForWebinar',
  async ({ webinarId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/webinar-registrations/${webinarId}`, formData);
      return { webinarId, registration: response.data };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        return rejectWithValue((err.response.data as { message?: string }).message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

// Feedback submission (future)
export const submitWebinarFeedback = createAsyncThunk<
  Record<string, unknown>,
  SubmitWebinarFeedbackArgs,
  { rejectValue: string }
>(
  'webinarRegistration/submitWebinarFeedback',
  async ({ webinarId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/webinar-feedback/${webinarId}`, feedbackData);
      return response.data;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        return rejectWithValue((err.response.data as { message?: string }).message || 'Feedback submission failed');
      }
      return rejectWithValue('Feedback submission failed');
    }
  }
);

const webinarRegistrationSlice = createSlice({
  name: 'webinarRegistration',
  initialState: {
    registering: false,
    registrationSuccess: false,
    registrationError: null as string | null,
    feedbackSubmitting: false,
    feedbackSuccess: false,
    feedbackError: null as string | null,
    registrationStatus: {} as Record<string, boolean>, // webinarId -> isRegistered
  },
  reducers: {
    resetRegistrationState: (state) => {
      state.registering = false;
      state.registrationSuccess = false;
      state.registrationError = null;
    },
    resetFeedbackState: (state) => {
      state.feedbackSubmitting = false;
      state.feedbackSuccess = false;
      state.feedbackError = null;
    },
    setRegistrationStatus: (state, action) => {
      const { webinarId, isRegistered } = action.payload;
      state.registrationStatus[webinarId] = isRegistered;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerForWebinar.pending, (state) => {
        state.registering = true;
        state.registrationSuccess = false;
        state.registrationError = null;
      })
      .addCase(registerForWebinar.fulfilled, (state, action) => {
        state.registering = false;
        state.registrationSuccess = true;
        if (action.payload?.webinarId) {
          state.registrationStatus[action.payload.webinarId] = true;
        }
      })
      .addCase(registerForWebinar.rejected, (state, action) => {
        state.registering = false;
        state.registrationError = action.payload || 'Registration failed';
      })
      // Registration status check
      .addCase(checkWebinarRegistration.fulfilled, (state, action) => {
        if (action.payload?.webinarId) {
          state.registrationStatus[action.payload.webinarId] = action.payload.isRegistered;
        }
      })
      // Feedback
      .addCase(submitWebinarFeedback.pending, (state) => {
        state.feedbackSubmitting = true;
        state.feedbackSuccess = false;
        state.feedbackError = null;
      })
      .addCase(submitWebinarFeedback.fulfilled, (state) => {
        state.feedbackSubmitting = false;
        state.feedbackSuccess = true;
      })
      .addCase(submitWebinarFeedback.rejected, (state, action) => {
        state.feedbackSubmitting = false;
        state.feedbackError = action.payload || 'Feedback submission failed';
      });
  },
});

export const { resetRegistrationState, resetFeedbackState, setRegistrationStatus } = webinarRegistrationSlice.actions;
export default webinarRegistrationSlice.reducer;
