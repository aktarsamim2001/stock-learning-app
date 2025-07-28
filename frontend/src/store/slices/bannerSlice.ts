import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

export interface Banner {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface BannerState {
  items: Banner[];
  loading: boolean;
  error?: string;
}

export const fetchBanners = createAsyncThunk<Banner[]>('banners/fetchBanners', async () => {
  const response = await axios.get('/api/banners');
  return response.data;
});

export const createBanner = createAsyncThunk<Banner, Partial<Banner>>('banners/createBanner', async (bannerData) => {
  const response = await axios.post('/api/banners', bannerData);
  return response.data;
});

export const updateBanner = createAsyncThunk<Banner, { id: string; bannerData: Partial<Banner> }>(
  'banners/updateBanner',
  async ({ id, bannerData }) => {
    const response = await axios.put(`/api/banners/${id}`, bannerData);
    return response.data;
  }
);

export const deleteBanner = createAsyncThunk<string, string>('banners/deleteBanner', async (id) => {
  await axios.delete(`/api/banners/${id}`);
  return id;
});

const initialState: BannerState = {
  items: [],
  loading: false,
  error: undefined,
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.items.push(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBanner.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;
