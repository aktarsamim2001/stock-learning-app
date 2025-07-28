import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  approveCourse,
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isInstructor, isAdmin } from '../middleware/roleCheckMiddleware.js';
import { courseValidation } from '../middleware/courseValidation.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', protect, getCourseById);

// Protected routes
router.post('/', protect, isInstructor, upload.single('thumbnail'), courseValidation, createCourse);
router.put('/:id', protect, isInstructor, updateCourse);
router.delete('/:id', protect, isInstructor, deleteCourse);
router.patch('/:id/approve', protect, isAdmin, approveCourse);

export default router;