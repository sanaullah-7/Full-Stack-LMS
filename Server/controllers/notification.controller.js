import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notification.Service.js";

export const listNotifications = async (req, res) => {
  try {
    const result = await getNotifications({
      limit: req.query.limit,
    });
    res.status(200).json({
      success: true,
      count: result.count,
      unreadCount: result.unreadCount,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

export const unreadCount = async (req, res) => {
  try {
    const result = await getUnreadCount();
    res.status(200).json({
      success: true,
      unreadCount: result.unreadCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch unread count",
    });
  }
};

export const markRead = async (req, res) => {
  try {
    const notification = await markNotificationRead(req.params.id);
    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    const status = error.message === "Notification not found" ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to mark notification as read",
    });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const result = await markAllNotificationsRead();
    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark all as read",
    });
  }
};
