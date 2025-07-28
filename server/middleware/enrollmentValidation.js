import { check } from 'express-validator';

export const enrollmentValidation = [
  check('progress')
    .optional()
    .isNumeric()
    .withMessage('Progress must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  
  check('completedLessonId')
    .optional()
    .isMongoId()
    .withMessage('Invalid lesson ID'),
];