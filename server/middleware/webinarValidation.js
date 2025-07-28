import { check } from 'express-validator';

export const webinarValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Webinar title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Webinar description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  check('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start time must be in the future');
      }
      return true;
    }),
  
  check('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 minutes and 8 hours'),
  
  check('link')
    .trim()
    .notEmpty()
    .withMessage('Webinar link is required')
    .isURL()
    .withMessage('Please enter a valid URL'),
  
  check('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum attendees must be at least 1'),
  
  check('recordingUrl')
    .optional()
    .isURL()
    .withMessage('Please enter a valid URL for the recording'),
];