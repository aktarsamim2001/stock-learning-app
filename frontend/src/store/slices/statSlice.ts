import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export interface Stat {
  _id: string;
  label: string;
  value: number;
}

interface StatState {
  items: Stat[];
  loading: boolean;
  error?: string;
}

export const fetchStats = createAsyncThunk<Stat[]>('stats/fetchStats', async () => {
  const response = await axios.get('/api/stats');
  return response.data;
});

export const createStat = createAsyncThunk<Stat, Partial<Stat>>('stats/createStat', async (statData) => {
  const response = await axios.post('/api/stats', statData);
  return response.data;
});

export const updateStat = createAsyncThunk<Stat, { id: string; statData: Partial<Stat> }>('stats/updateStat', async ({ id, statData }) => {
  const response = await axios.put(`/api/stats/${id}`, statData);
  return response.data;
});

export const deleteStat = createAsyncThunk<string, string>('stats/deleteStat', async (id) => {
  await axios.delete(`/api/stats/${id}`);
  return id;
});

const initialState: StatState = {
  items: [],
  loading: false,
  error: undefined,
};

const statSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<Stat[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createStat.fulfilled, (state, action: PayloadAction<Stat>) => {
        state.items.push(action.payload);
      })
      .addCase(updateStat.fulfilled, (state, action: PayloadAction<Stat>) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteStat.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      });
  },
});

export default statSlice.reducer;
