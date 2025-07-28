import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import {
    getAdminNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(checkRole('admin'));

router.get('/', getAdminNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

export default router;
