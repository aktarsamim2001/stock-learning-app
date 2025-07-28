import express from 'express';
import {
    submitContactForm,
    getAllContacts,
    markAsReplied,
    deleteContact,
    getContactInfo
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';
import { contactValidation } from '../middleware/contactValidation.js';

const router = express.Router();

// Public routes
router.post('/', contactValidation, submitContactForm);
router.get('/info', getContactInfo);

// Admin routes - protected
router.use(protect);
router.use(isAdmin);

router.get('/', getAllContacts);
router.patch('/:id/reply', markAsReplied);
router.delete('/:id', deleteContact);

export default router;
