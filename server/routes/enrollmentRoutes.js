import express from 'express';
import {
  enrollCourse,
  getUserEnrollments,
  updateProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { enrollmentValidation } from '../middleware/enrollmentValidation.js';

const router = express.Router();

router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/my-courses', protect, getUserEnrollments);
router.patch('/progress/:courseId', protect, enrollmentValidation, updateProgress);

export default router;