import express from 'express';
const router = express.Router();

import {
  createPrivacyPolicy,
  updatePrivacyPolicy,
  getAllPrivacyPolicies,
  getActivePrivacyPolicy,
} from '../controllers/privacyPolicyController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// Public route (anyone can see active privacy policy)
router.get('/active', getActivePrivacyPolicy);

// Protected + Admin routes
router.use(protect);
router.use(admin);

router.route('/')
  .post(createPrivacyPolicy)
  .get(getAllPrivacyPolicies);

router.route('/:id')
  .put(updatePrivacyPolicy);

export default router;
