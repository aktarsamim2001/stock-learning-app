
import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  getCourseStats,
  getRevenueAnalytics,
  exportUsers,
  exportCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
} from '../controllers/adminController.js';
import upload from '../middleware/uploadMiddleware.js';
import { courseValidation } from '../middleware/courseValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';
import { userUpdateValidation } from '../middleware/userValidation.js';

const router = express.Router();

// Admin create, edit, and delete course routes
router.post('/courses', protect, isAdmin, upload.single('thumbnail'), courseValidation, adminCreateCourse);
router.put('/courses/:id', protect, isAdmin, upload.single('thumbnail'), courseValidation, adminUpdateCourse);
router.delete('/courses/:id', protect, isAdmin, adminDeleteCourse);

// User management routes
router.get('/users', protect, isAdmin, getUsers);
router.patch('/users/:id', protect, isAdmin, userUpdateValidation, updateUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Course management routes
router.get('/courses/stats', protect, isAdmin, getCourseStats);

// Analytics routes
router.get('/analytics/revenue', protect, isAdmin, getRevenueAnalytics);

// Export routes
router.get('/export/users', protect, isAdmin, exportUsers);
router.get('/export/courses', protect, isAdmin, exportCourses);

export default router;