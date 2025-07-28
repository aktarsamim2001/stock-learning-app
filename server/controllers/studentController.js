
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Payment from '../models/paymentModel.js';
import Webinar from '../models/webinarModel.js';

// @desc    Get student's enrolled courses with progress
// @route   GET /api/student/courses
// @access  Private/Student
export const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate({
        path: 'courseId',
        select: 'title description thumbnail lessons',
        populate: {
          path: 'instructorId',
          select: 'name profileImage'
        }
      })
      .sort('-enrolledAt');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's certificates
// @route   GET /api/student/certificates
// @access  Private/Student
export const getCertificates = async (req, res) => {
  try {
    const completedEnrollments = await Enrollment.find({
      userId: req.user._id,
      progress: 100,
      certificateIssued: true
    }).populate('courseId', 'title');

    res.json(completedEnrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended courses
// @route   GET /api/student/recommendations
// @access  Private/Student
export const getRecommendedCourses = async (req, res) => {
  try {
    // Get student's enrolled courses
    const enrolledCourses = await Enrollment.find({ userId: req.user._id })
      .select('courseId');
    
    const enrolledCourseIds = enrolledCourses.map(e => e.courseId);

    // Find courses in similar categories but not enrolled
    const recommendations = await Course.find({
      _id: { $nin: enrolledCourseIds },
      published: true,
      approved: true
    })
      .populate('instructorId', 'name profileImage')
      .limit(6);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's quiz results
// @route   GET /api/student/quiz-results
// @access  Private/Student
export const getQuizResults = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId', 'title')
      .select('quizResults');

    const results = enrollments.map(enrollment => ({
      courseTitle: enrollment.courseId.title,
      results: enrollment.quizResults || []
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's payment history
// @route   GET /api/student/payments
// @access  Private/Student
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseId', 'title price')
      .sort('-createdAt');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's upcoming webinars
// @route   GET /api/student/webinars
// @access  Private/Student
export const getUpcomingWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({
      attendees: req.user._id,
      startTime: { $gt: new Date() }
    })
      .populate('speaker', 'name profileImage')
      .sort('startTime');

    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};