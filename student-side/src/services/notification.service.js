import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Notifications Service for Student Portal
 */
export const notificationService = {
  /**
   * Fetches all notifications for the logged-in student
   */
  getNotifications: async () => {
    const response = await axiosClient.get(ENDPOINTS.NOTIFICATIONS.GET_ALL);
    return response?.notifications || [];
  },

  /**
   * Marks all notifications as read
   */
  markAllAsRead: async () => {
    return await axiosClient.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },
};
