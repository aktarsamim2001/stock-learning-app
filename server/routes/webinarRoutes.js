import express from 'express';
import {
  createWebinar,
  getWebinars,
  getWebinarById,
  updateWebinar,
  deleteWebinar,
  registerForWebinar,
  updateWebinarStatus,
  isRegisteredForWebinar,
} from '../controllers/webinarController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isInstructor } from '../middleware/roleCheckMiddleware.js';
import { webinarValidation } from '../middleware/webinarValidation.js';

const router = express.Router();

// Public routes
router.get('/', getWebinars);
router.get('/:id', getWebinarById);
router.get('/:id/is-registered', protect, isRegisteredForWebinar);

// Protected routes
router.post('/', protect, isInstructor, webinarValidation, createWebinar);
router.put('/:id', protect, isInstructor, webinarValidation, updateWebinar);
router.delete('/:id', protect, isInstructor, deleteWebinar);
router.patch('/register/:id', protect, registerForWebinar);
router.patch('/:id/status', protect, isInstructor, updateWebinarStatus);

export default router;