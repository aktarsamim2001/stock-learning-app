
import express from 'express';
import {
  getAdminStats,
  getInstructorStats,
  getStudentStats
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, isInstructor } from '../middleware/roleCheckMiddleware.js';

const router = express.Router();

router.get('/admin', protect, isAdmin, getAdminStats);
router.get('/instructor', protect, isInstructor, getInstructorStats);
router.get('/student', protect, getStudentStats);

export default router;