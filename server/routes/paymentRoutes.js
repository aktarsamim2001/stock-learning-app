import express from 'express';
import {
  createPaymentIntent,
  verifyPayment,
  getPayments,
  getPaymentById,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  paymentValidation,
  verifyPaymentValidation,
} from '../middleware/paymentValidation.js';

const router = express.Router();

router.post('/create', protect, paymentValidation, createPaymentIntent);
router.post('/verify', protect, verifyPaymentValidation, verifyPayment);
router.get('/history', protect, getPayments);
router.get('/:id', protect, getPaymentById);

export default router;