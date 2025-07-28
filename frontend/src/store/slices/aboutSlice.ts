import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAbout = createAsyncThunk('about/fetchAbout', async () => {
  const res = await axios.get('/api/about')
  return res.data
})

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    content: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false
        state.content = action.payload
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default aboutSlice.reducer
