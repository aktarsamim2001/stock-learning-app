import express from 'express';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  toggleLike,
  addComment,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { blogValidation } from '../middleware/blogValidation.js';
import upload from '../middleware/multerForForm.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', protect, upload.none(), blogValidation, createBlog);
router.put('/:id', protect, upload.none(), blogValidation, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

export default router;