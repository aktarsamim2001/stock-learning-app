import express from 'express';
import * as faqController from '../controllers/faqController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all FAQs
router.get('/', faqController.getFAQs);

// Admin: Create FAQ
router.post('/', authenticateAdmin, faqController.createFAQ);

// Admin: Update FAQ
router.put('/:id', authenticateAdmin, faqController.updateFAQ);

// Admin: Delete FAQ
router.delete('/:id', authenticateAdmin, faqController.deleteFAQ);

export default router;
