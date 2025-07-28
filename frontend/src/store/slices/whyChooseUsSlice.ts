import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export interface WhyChooseUs {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

interface WhyChooseUsState {
  items: WhyChooseUs[];
  loading: boolean;
  error?: string;
}

export const fetchWhyChooseUs = createAsyncThunk<WhyChooseUs[]>('whyChooseUs/fetchWhyChooseUs', async () => {
  const response = await axios.get('/api/why-choose-us');
  return response.data;
});

export const createWhyChooseUs = createAsyncThunk<WhyChooseUs, Partial<WhyChooseUs>>('whyChooseUs/createWhyChooseUs', async (data) => {
  const response = await axios.post('/api/why-choose-us', data);
  return response.data;
});

export const updateWhyChooseUs = createAsyncThunk<WhyChooseUs, { id: string; data: Partial<WhyChooseUs> }>('whyChooseUs/updateWhyChooseUs', async ({ id, data }) => {
  const response = await axios.put(`/api/why-choose-us/${id}`, data);
  return response.data;
});

export const deleteWhyChooseUs = createAsyncThunk<string, string>('whyChooseUs/deleteWhyChooseUs', async (id) => {
  await axios.delete(`/api/why-choose-us/${id}`);
  return id;
});

const initialState: WhyChooseUsState = {
  items: [],
  loading: false,
  error: undefined,
};

const whyChooseUsSlice = createSlice({
  name: 'whyChooseUs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhyChooseUs.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchWhyChooseUs.fulfilled, (state, action: PayloadAction<WhyChooseUs[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWhyChooseUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createWhyChooseUs.fulfilled, (state, action: PayloadAction<WhyChooseUs>) => {
        state.items.push(action.payload);
      })
      .addCase(updateWhyChooseUs.fulfilled, (state, action: PayloadAction<WhyChooseUs>) => {
        const idx = state.items.findIndex((w) => w._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteWhyChooseUs.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((w) => w._id !== action.payload);
      });
  },
});

export default whyChooseUsSlice.reducer;
