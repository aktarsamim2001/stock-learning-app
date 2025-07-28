import { check } from 'express-validator';

export const blogValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Blog title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  check('content')
    .trim()
    .notEmpty()
    .withMessage('Blog content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters'),
  
  check('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  check('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag cannot be empty'),
  
  check('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
];

export const commentValidation = [
  check('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
];