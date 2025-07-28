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

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', protect, blogValidation, createBlog);
router.put('/:id', protect, blogValidation, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

export default router;