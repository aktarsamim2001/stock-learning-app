import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { roleCheckMiddleware } from '../middleware/roleCheckMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all banners
router.get('/', getBanners);

// Admin: Create, Update, Delete
router.post('/', authMiddleware, roleCheckMiddleware(['admin']), createBanner);
router.put('/:id', authMiddleware, roleCheckMiddleware(['admin']), updateBanner);
router.delete('/:id', authMiddleware, roleCheckMiddleware(['admin']), deleteBanner);

export default router;
