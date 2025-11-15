// @desc    Admin update a course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
export const adminUpdateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    let thumbnailPath = course.thumbnail;
    if (req.file) {
      thumbnailPath = `/uploads/course-thumbnails/${req.file.filename}`;
    } else if (req.body.thumbnailUrl) {
      thumbnailPath = req.body.thumbnailUrl;
    }
    // Only update fields that are present in req.body
    const updateFields = { ...req.body };
    if (req.body.lessons) {
      updateFields.lessons = JSON.parse(req.body.lessons);
    }
    updateFields.thumbnail = thumbnailPath;
    Object.keys(updateFields).forEach((key) => {
      course[key] = updateFields[key];
    });
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
export const adminDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Course from '../models/courseModel.js';
import { validationResult } from 'express-validator';

// @desc    Admin create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
export const adminCreateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let thumbnailPath = '';
    if (req.file) {
      thumbnailPath = `/uploads/course-thumbnails/${req.file.filename}`;
    } else if (req.body.thumbnailUrl) {
      thumbnailPath = req.body.thumbnailUrl;
    }
    const course = new Course({
      ...req.body,
      instructorId: req.body.instructorId || req.user.id, // allow admin to set instructor
      thumbnail: thumbnailPath || req.body.thumbnail || '',
      lessons: req.body.lessons ? JSON.parse(req.body.lessons) : [],
      approved: true,
      published: true,
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import User from '../models/userModel.js';
import Payment from '../models/paymentModel.js';

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, status } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role and status
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { role, status, approved } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) user.role = role;
    if (status) user.status = status;
    if (approved !== undefined) user.approved = approved;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course management stats
// @route   GET /api/admin/courses/stats
// @access  Private/Admin
export const getCourseStats = async (req, res) => {
  try {
    const [
      totalCourses,
      pendingApproval,
      publishedCourses,
      totalRevenue,
      categoryStats,
      courses, // Add this line
    ] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ approved: false }),
      Course.countDocuments({ published: true, approved: true }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Course.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Course.find().populate('instructorId', 'name').lean() // Fetch all courses with instructor name
    ]);

    res.json({
      totalCourses,
      pendingApproval,
      publishedCourses,
      totalRevenue: totalRevenue[0]?.total || 0,
      categoryStats,
      courses, // Add courses to response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'completed' };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const revenueData = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export users data
// @route   GET /api/admin/export/users
// @access  Private/Admin
export const exportUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    const csv = users.map(user => ({
      ID: user._id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      Approved: user.approved,
      'Created At': user.createdAt,
    }));

    res.json(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export courses data
// @route   GET /api/admin/export/courses
// @access  Private/Admin
export const exportCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructorId', 'name email')
      .lean();

    const csv = courses.map(course => ({
      ID: course._id,
      Title: course.title,
      Instructor: course.instructorId.name,
      Category: course.category,
      Price: course.price,
      Published: course.published,
      Approved: course.approved,
      'Created At': course.createdAt,
    }));

    res.json(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};