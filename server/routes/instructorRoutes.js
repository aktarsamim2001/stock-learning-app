import express from 'express';
import User from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all instructors
// @route   GET /api/users/instructors
// @access  Private/Admin or Instructor
router.get('/instructors', protect, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor', approved: true, status: 'active' }).select('_id name email profileImage');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
