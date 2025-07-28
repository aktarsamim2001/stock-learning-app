import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Payment from '../models/paymentModel.js';
import Webinar from '../models/webinarModel.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalInstructors,
      totalRevenue,
      pendingApprovals,
      recentActivities,
      courses
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      User.countDocuments({ role: 'instructor' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.find({ approved: false, role: { $in: ['instructor', 'admin'] } })
        .select('name email role createdAt')
        .sort('-createdAt'),
      // Get recent activities (enrollments, course creations, etc.)
      Payment.find()
        .populate('userId', 'name')
        .populate('courseId', 'title')
        .sort('-createdAt')
        .limit(10),
      Course.find({}).populate('instructor', 'name') // Fetch all courses and populate instructor name
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalInstructors,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingApprovals,
      recentActivities: recentActivities.map(activity => ({
        _id: activity._id,
        type: 'payment',
        description: `${activity.userId.name} enrolled in ${activity.courseId.title}`,
        createdAt: activity.createdAt
      })),
      detailedCourses: courses // Add the detailed courses to the response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/instructor/dashboard
// @access  Private/Instructor
export const getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const [courses, enrollments, payments, upcomingWebinars] = await Promise.all([
      Course.find({ instructorId }),
      Enrollment.find({ courseId: { $in: (await Course.find({ instructorId })).map(c => c._id) } }),
      Payment.find({
        courseId: { $in: (await Course.find({ instructorId })).map(c => c._id) },
        status: 'completed'
      }),
      Webinar.find({
        speaker: instructorId,
        startTime: { $gt: new Date() }
      }).sort('startTime')
    ]);

    const courseStats = {
      totalEnrollments: enrollments.length,
      averageRating: courses.reduce((acc, course) => acc + (course.rating || 0), 0) / courses.length || 0,
      totalRevenue: payments.reduce((acc, payment) => acc + payment.amount, 0),
      studentProgress: enrollments.reduce((acc, enroll) => acc + enroll.progress, 0) / enrollments.length || 0
    };

    res.json({
      courseStats,
      upcomingWebinars
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Private/Student
export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [enrollments, upcomingWebinars] = await Promise.all([
      Enrollment.find({ userId })
        .populate('courseId', 'title description thumbnail'),
      Webinar.find({
        attendees: userId,
        startTime: { $gt: new Date() }
      }).sort('startTime')
    ]);

    const stats = {
      totalCourses: enrollments.length,
      completedCourses: enrollments.filter(e => e.progress === 100).length,
      learningHours: enrollments.reduce((acc, e) => {
        const course = e.courseId;
        return acc + (course.lessons?.reduce((sum, lesson) => sum + lesson.duration, 0) || 0);
      }, 0),
      averageRating: 4.5, // This would be calculated based on student's course ratings
      upcomingWebinars
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};