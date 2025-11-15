import express from 'express';
const router = express.Router();

import {
  createTermsCondition,
  updateTermsCondition,
  getAllTermsConditions,
  getActiveTermsCondition,
} from '../controllers/termsConditionController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// Public route (anyone can see active terms)
router.get('/active', getActiveTermsCondition);

// Protected + Admin routes
router.use(protect);
router.use(admin);

router.route('/')
  .post(createTermsCondition)
  .get(getAllTermsConditions);

router.route('/:id')
  .put(updateTermsCondition);

export default router;
