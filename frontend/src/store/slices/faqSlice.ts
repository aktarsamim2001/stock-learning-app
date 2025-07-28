import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FaqState {
  items: Faq[];
  loading: boolean;
  error?: string;
}

export const fetchFaqs = createAsyncThunk<Faq[]>('faqs/fetchFaqs', async () => {
  const response = await axios.get('/api/faqs');
  return response.data;
});

export const createFaq = createAsyncThunk<Faq, Partial<Faq>>('faqs/createFaq', async (faqData) => {
  const response = await axios.post('/api/faqs', faqData);
  return response.data;
});

export const updateFaq = createAsyncThunk<Faq, { id: string; faqData: Partial<Faq> }>('faqs/updateFaq', async ({ id, faqData }) => {
  const response = await axios.put(`/api/faqs/${id}`, faqData);
  return response.data;
});

export const deleteFaq = createAsyncThunk<string, string>('faqs/deleteFaq', async (id) => {
  await axios.delete(`/api/faqs/${id}`);
  return id;
});

const initialState: FaqState = {
  items: [],
  loading: false,
  error: undefined,
};

const faqSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchFaqs.fulfilled, (state, action: PayloadAction<Faq[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createFaq.fulfilled, (state, action: PayloadAction<Faq>) => {
        state.items.push(action.payload);
      })
      .addCase(updateFaq.fulfilled, (state, action: PayloadAction<Faq>) => {
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteFaq.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((f) => f._id !== action.payload);
      });
  },
});

export default faqSlice.reducer;
