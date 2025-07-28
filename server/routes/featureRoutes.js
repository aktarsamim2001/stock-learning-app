import express from 'express';
import {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature
} from '../controllers/featureController.js';
import { roleCheckMiddleware } from '../middleware/roleCheckMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all features
router.get('/', getFeatures);

// Admin: Create, Update, Delete
router.post('/', authMiddleware, roleCheckMiddleware(['admin']), createFeature);
router.put('/:id', authMiddleware, roleCheckMiddleware(['admin']), updateFeature);
router.delete('/:id', authMiddleware, roleCheckMiddleware(['admin']), deleteFeature);

export default router;
