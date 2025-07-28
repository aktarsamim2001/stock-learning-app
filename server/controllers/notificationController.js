import Notification from '../models/notificationModel.js';

// Create a new notification
const createNotification = async (userId, title, message, type, relatedId = null, onModel = null) => {
  try {    const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        relatedId,
        onModel
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get all notifications for admin
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
        .populate('user', 'name email')
        .populate('relatedId')
        .sort('-createdAt')
        .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
    );
    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
        { isRead: false },
        { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    createNotification,
    getAdminNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};
