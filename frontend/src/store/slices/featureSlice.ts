import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export const fetchFeatures = createAsyncThunk('features/fetchFeatures', async () => {
  const response = await axios.get('/api/features');
  return response.data;
});

export const createFeature = createAsyncThunk('features/createFeature', async (featureData) => {
  const response = await axios.post('/api/features', featureData);
  return response.data;
});

export const updateFeature = createAsyncThunk('features/updateFeature', async ({ id, featureData }) => {
  const response = await axios.put(`/api/features/${id}`, featureData);
  return response.data;
});

export const deleteFeature = createAsyncThunk('features/deleteFeature', async (id) => {
  await axios.delete(`/api/features/${id}`);
  return id;
});

const featureSlice = createSlice({
  name: 'features',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createFeature.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f._id !== action.payload);
      });
  },
});

export default featureSlice.reducer;
