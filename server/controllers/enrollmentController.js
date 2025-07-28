import { validationResult } from 'express-validator';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import { createNotification } from './notificationController.js';

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.published || !course.approved) {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    // Only allow direct enrollment for free courses
    if (course.price > 0) {
      return res.status(400).json({ message: 'This course requires payment. Please complete payment to enroll.' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      userId: req.user._id,
      courseId: course._id,
      paymentStatus: 'completed', // Free course, so mark as completed
    });

    const createdEnrollment = await enrollment.save();

    // Update course enrolled students
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Create notification for admin
    await createNotification(
      'admin',
      'New Course Enrollment',
      `${req.user.name} has enrolled in ${course.title}`,
      'enrollment',
      createdEnrollment._id,
      'Enrollment'
    );

    res.status(201).json(createdEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId', 'title description thumbnail')
      .sort('-enrolledAt');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course progress
// @route   PATCH /api/enrollments/progress/:courseId
// @access  Private
export const updateProgress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { progress, completedLessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update progress
    if (typeof progress === 'number') {
      enrollment.progress = Math.min(Math.max(progress, 0), 100);
    }

    // Add completed lesson if provided
    if (completedLessonId) {
      const lessonExists = enrollment.completedLessons.some(
        lesson => lesson.lessonId.toString() === completedLessonId
      );

      if (!lessonExists) {
        enrollment.completedLessons.push({
          lessonId: completedLessonId,
        });
      }
    }

    enrollment.lastAccessedAt = new Date();
    const updatedEnrollment = await enrollment.save();

    // Create notification when course is completed
    if (enrollment.progress === 100) {
      await createNotification(
        'admin',
        'Course Completion',
        `${req.user.name} has completed the course: ${req.params.courseId}`,
        'course',
        req.params.courseId,
        'Course'
      );
    }

    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};