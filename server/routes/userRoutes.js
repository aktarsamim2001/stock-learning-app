import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  getUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
} from "../middleware/userValidation.js";

const router = express.Router();

// Get users
router.get("/instructors", getUsers);

// Register user
router.post("/register", registerValidation, registerUser);

// Login user
router.post("/login", loginValidation, loginUser);

// Logout user
router.post("/logout", protect, logoutUser);

// Get user profile
router.get("/profile", protect, getProfile);

// Update user profile
router.put("/profile", protect, profileUpdateValidation, updateProfile);

export default router;
