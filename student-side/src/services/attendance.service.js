import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Student Attendance Service
 */
export const attendanceService = {
  /**
   * Fetches all attendance logs and history for the logged-in student
   */
  getAttendanceRecords: async () => {
    return await axiosClient.get(ENDPOINTS.ATTENDANCE.GET_RECORDS);
  },
};
