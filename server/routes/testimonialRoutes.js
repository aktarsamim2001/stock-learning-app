import express from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all testimonials
router.get('/', testimonialController.getTestimonials);

// Admin: Create a testimonial
router.post('/', authenticateAdmin, testimonialController.createTestimonial);

// Admin: Update a testimonial
router.put('/:id', authenticateAdmin, testimonialController.updateTestimonial);

// Admin: Delete a testimonial
router.delete('/:id', authenticateAdmin, testimonialController.deleteTestimonial);

export default router;
