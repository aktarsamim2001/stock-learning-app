import express from 'express';
import { registerForWebinar } from '../controllers/webinarRegistrationController.js';
import { body } from 'express-validator';

const router = express.Router();

// POST /api/webinar-registrations/:id
router.post(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  registerForWebinar
);

export default router;
