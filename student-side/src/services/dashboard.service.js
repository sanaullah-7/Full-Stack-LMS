import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Student Dashboard Aggregation Service
 */
export const dashboardService = {
  /**
   * Fetches summary statistics, student details, and attendance metrics for dashboard
   */
  getDashboardData: async () => {
    return await axiosClient.get(ENDPOINTS.DASHBOARD.GET_OVERVIEW);
  },
};
