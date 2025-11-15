import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';

// Async thunks for Privacy Policy
export const fetchActivePrivacyPolicy = createAsyncThunk(
    'legal/fetchActivePrivacyPolicy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/privacy-policy/active');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching privacy policy');
        }
    }
);

export const createPrivacyPolicy = createAsyncThunk(
    'legal/createPrivacyPolicy',
    async (policyData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/privacy-policy', policyData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error creating privacy policy');
        }
    }
);

export const updatePrivacyPolicy = createAsyncThunk(
    'legal/updatePrivacyPolicy',
    async ({ id, policyData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/privacy-policy/${id}`, policyData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error updating privacy policy');
        }
    }
);

export const getAllPrivacyPolicies = createAsyncThunk(
    'legal/getAllPrivacyPolicies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/privacy-policy');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching all privacy policies');
        }
    }
);

// Async thunks for Terms & Conditions
export const fetchActiveTermsConditions = createAsyncThunk(
    'legal/fetchActiveTermsConditions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/terms-conditions/active');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching terms and conditions');
        }
    }
);

export const createTermsConditions = createAsyncThunk(
    'legal/createTermsConditions',
    async (termsData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/terms-conditions', termsData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error creating terms and conditions');
        }
    }
);

export const updateTermsConditions = createAsyncThunk(
    'legal/updateTermsConditions',
    async ({ id, termsData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/terms-conditions/${id}`, termsData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error updating terms and conditions');
        }
    }
);

export const getAllTermsConditions = createAsyncThunk(
    'legal/getAllTermsConditions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/terms-conditions');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching all terms and conditions');
        }
    }
);

const initialState = {
    privacyPolicy: {
        active: null,
        all: [],
        loading: false,
        error: null
    },
    termsConditions: {
        active: null,
        all: [],
        loading: false,
        error: null
    }
};

const legalSlice = createSlice({
    name: 'legal',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.privacyPolicy.error = null;
            state.termsConditions.error = null;
        }
    },
    extraReducers: (builder) => {
        // Privacy Policy reducers
        builder
            .addCase(fetchActivePrivacyPolicy.pending, (state) => {
                state.privacyPolicy.loading = true;
            })
            .addCase(fetchActivePrivacyPolicy.fulfilled, (state, action) => {
                state.privacyPolicy.loading = false;
                state.privacyPolicy.active = action.payload;
                state.privacyPolicy.error = null;
            })
            .addCase(fetchActivePrivacyPolicy.rejected, (state, action) => {
                state.privacyPolicy.loading = false;
                state.privacyPolicy.error = action.payload;
            })
            .addCase(getAllPrivacyPolicies.fulfilled, (state, action) => {
                state.privacyPolicy.all = action.payload;
                state.privacyPolicy.error = null;
            })
            .addCase(createPrivacyPolicy.fulfilled, (state, action) => {
                state.privacyPolicy.all.unshift(action.payload);
                state.privacyPolicy.active = action.payload;
                state.privacyPolicy.error = null;
            })
            .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
                state.privacyPolicy.all = state.privacyPolicy.all.map(policy =>
                    policy._id === action.payload._id ? action.payload : policy
                );
                if (action.payload.isActive) {
                    state.privacyPolicy.active = action.payload;
                }
                state.privacyPolicy.error = null;
            })

        // Terms & Conditions reducers
            .addCase(fetchActiveTermsConditions.pending, (state) => {
                state.termsConditions.loading = true;
            })
            .addCase(fetchActiveTermsConditions.fulfilled, (state, action) => {
                state.termsConditions.loading = false;
                state.termsConditions.active = action.payload;
                state.termsConditions.error = null;
            })
            .addCase(fetchActiveTermsConditions.rejected, (state, action) => {
                state.termsConditions.loading = false;
                state.termsConditions.error = action.payload;
            })
            .addCase(getAllTermsConditions.fulfilled, (state, action) => {
                state.termsConditions.all = action.payload;
                state.termsConditions.error = null;
            })
            .addCase(createTermsConditions.fulfilled, (state, action) => {
                state.termsConditions.all.unshift(action.payload);
                state.termsConditions.active = action.payload;
                state.termsConditions.error = null;
            })
            .addCase(updateTermsConditions.fulfilled, (state, action) => {
                state.termsConditions.all = state.termsConditions.all.map(terms =>
                    terms._id === action.payload._id ? action.payload : terms
                );
                if (action.payload.isActive) {
                    state.termsConditions.active = action.payload;
                }
                state.termsConditions.error = null;
            });
    }
});

export const { clearErrors } = legalSlice.actions;
export default legalSlice.reducer;
