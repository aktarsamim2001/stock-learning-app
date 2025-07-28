import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
  tags: string[];
  published: boolean;
  thumbnail: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  blogs: Blog[];
  blog: Blog | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/blogs');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/blogs', blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }: { id: string; blogData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/blogs/${id}`, blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

export const toggleBlogLike = createAsyncThunk(
  'blogs/toggleLike',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/blogs/${id}/like`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const addBlogComment = createAsyncThunk(
  'blogs/addComment',
  async ({ id, content }: { id: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, { content });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearBlog: (state) => {
      state.blog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.blog = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        if (state.blog?._id === action.payload) {
          state.blog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle Like
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        );
        if (state.blog?._id === updatedBlog._id) {
          state.blog = updatedBlog;
        }
      })
      
      // Add Comment
      .addCase(addBlogComment.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        );
        if (state.blog?._id === updatedBlog._id) {
          state.blog = updatedBlog;
        }
      });
  },
});

export const { clearBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;