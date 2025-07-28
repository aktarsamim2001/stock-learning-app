import express from 'express';
import * as whyChooseUsController from '../controllers/whyChooseUsController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all items
router.get('/', whyChooseUsController.getWhyChooseUs);

// Admin: Create
router.post('/', authenticateAdmin, whyChooseUsController.createWhyChooseUs);

// Admin: Update
router.put('/:id', authenticateAdmin, whyChooseUsController.updateWhyChooseUs);

// Admin: Delete
router.delete('/:id', authenticateAdmin, whyChooseUsController.deleteWhyChooseUs);

export default router;
