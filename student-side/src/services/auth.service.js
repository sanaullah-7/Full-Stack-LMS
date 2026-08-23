import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Authentication Service for Student Portal
 */
export const authService = {
  /**
   * Logs in a student using Roll Number or Email and Password
   * @param {Object} credentials - { identifier: string, password: string }
   */
  login: async (credentials) => {
    return await axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Logs in an admin from the student login page
   * @param {Object} credentials - { email: string, password: string }
   */
  loginAdmin: async (credentials) => {
    return await axiosClient.post(ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
  },

  /**
   * Retrieves currently authenticated student details
   */
  getCurrentStudent: async () => {
    return await axiosClient.get(ENDPOINTS.AUTH.ME);
  },

  /**
   * Updates student account password
   * @param {Object} payload - { currentPassword: string, newPassword: string, confirmPassword: string }
   */
  changePassword: async (payload) => {
    return await axiosClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  /**
   * Logs out the current student session
   */
  logout: async () => {
    return true;
  },
};
