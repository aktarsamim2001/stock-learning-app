import { check } from 'express-validator';

export const paymentValidation = [
  check('courseId')
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID'),
];

export const verifyPaymentValidation = [
  check('razorpay_order_id')
    .notEmpty()
    .withMessage('Order ID is required'),
  check('razorpay_payment_id')
    .notEmpty()
    .withMessage('Payment ID is required'),
  check('razorpay_signature')
    .notEmpty()
    .withMessage('Payment signature is required'),
];