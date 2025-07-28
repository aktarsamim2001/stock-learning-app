import express from 'express';
import {
  getStats,
  createStat,
  updateStat,
  deleteStat
} from '../controllers/statController.js';
import { roleCheckMiddleware } from '../middleware/roleCheckMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all stats
router.get('/', getStats);

// Admin: Create, Update, Delete
router.post('/', authMiddleware, roleCheckMiddleware(['admin']), createStat);
router.put('/:id', authMiddleware, roleCheckMiddleware(['admin']), updateStat);
router.delete('/:id', authMiddleware, roleCheckMiddleware(['admin']), deleteStat);

export default router;
