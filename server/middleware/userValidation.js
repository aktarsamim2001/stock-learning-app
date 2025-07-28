import { check } from 'express-validator';

export const registerValidation = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role', 'Role must be student, instructor, or admin').isIn([
    'student',
    'instructor',
    'admin',
  ]),
];

export const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
];

export const profileUpdateValidation = [
  check('name', 'Name is required').optional().not().isEmpty().trim(),
  check('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),
];

export const userUpdateValidation = [
  check('role')
    .optional()
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Invalid role'),
  check('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Invalid status'),
  check('approved')
    .optional()
    .isBoolean()
    .withMessage('Approved must be a boolean'),
];