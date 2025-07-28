
import express from 'express';
import {
  getEnrolledCourses,
  getCertificates,
  getRecommendedCourses,
  getQuizResults,
  getPaymentHistory,
  getUpcomingWebinars
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/courses', protect, getEnrolledCourses);
router.get('/certificates', protect, getCertificates);
router.get('/recommendations', protect, getRecommendedCourses);
router.get('/quiz-results', protect, getQuizResults);
router.get('/payments', protect, getPaymentHistory);
router.get('/webinars', protect, getUpcomingWebinars);

export default router;