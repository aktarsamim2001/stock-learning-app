import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export interface Testimonial {
  _id: string;
  name: string;
  message: string;
  avatar?: string;
}

interface TestimonialState {
  items: Testimonial[];
  loading: boolean;
  error?: string;
}

export const fetchTestimonials = createAsyncThunk<Testimonial[]>('testimonials/fetchTestimonials', async () => {
  const response = await axios.get('/api/testimonials');
  return response.data;
});

export const createTestimonial = createAsyncThunk<Testimonial, Partial<Testimonial>>('testimonials/createTestimonial', async (testimonialData) => {
  const response = await axios.post('/api/testimonials', testimonialData);
  return response.data;
});

export const updateTestimonial = createAsyncThunk<Testimonial, { id: string; testimonialData: Partial<Testimonial> }>('testimonials/updateTestimonial', async ({ id, testimonialData }) => {
  const response = await axios.put(`/api/testimonials/${id}`, testimonialData);
  return response.data;
});

export const deleteTestimonial = createAsyncThunk<string, string>('testimonials/deleteTestimonial', async (id) => {
  await axios.delete(`/api/testimonials/${id}`);
  return id;
});

const initialState: TestimonialState = {
  items: [],
  loading: false,
  error: undefined,
};

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action: PayloadAction<Testimonial[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTestimonial.fulfilled, (state, action: PayloadAction<Testimonial>) => {
        state.items.push(action.payload);
      })
      .addCase(updateTestimonial.fulfilled, (state, action: PayloadAction<Testimonial>) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default testimonialSlice.reducer;
