import { check, body } from 'express-validator';

export const courseValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  check('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value >= 0)
    .withMessage('Price cannot be negative'),
  
  check('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  // Accept lessons as either an array or a stringified array (for FormData)
  body('lessons').custom((value, { req }) => {
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error();
        // Optionally, check lesson fields here
        return true;
      } catch {
        throw new Error('Lessons must be a valid array');
      }
    }
    throw new Error('Lessons must be an array');
  }),
  body('lessons').custom((value, { req }) => {
    let lessonsArr = value;
    if (typeof value === 'string') {
      try {
        lessonsArr = JSON.parse(value);
      } catch {
        return true; // Already handled above
      }
    }
    if (Array.isArray(lessonsArr)) {
      for (const lesson of lessonsArr) {
        if (!lesson.title || typeof lesson.title !== 'string' || !lesson.title.trim()) {
          throw new Error('Lesson title is required');
        }
        if (!lesson.content || typeof lesson.content !== 'string' || !lesson.content.trim()) {
          throw new Error('Lesson content is required');
        }
        if (typeof lesson.duration !== 'number' || lesson.duration <= 0) {
          throw new Error('Lesson duration must be positive');
        }
        if (typeof lesson.order !== 'number' || lesson.order < 0) {
          throw new Error('Lesson order must be non-negative');
        }
      }
    }
    return true;
  })
];