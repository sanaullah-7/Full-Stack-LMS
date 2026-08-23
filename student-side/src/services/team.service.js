import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Team & Project Service for Student Portal
 */
export const teamService = {
  /**
   * Fetches current assigned team details and member list
   */
  getMyTeam: async () => {
    const response = await axiosClient.get(ENDPOINTS.TEAM.GET_MY_TEAM);
    return response?.team || null;
  },

  /**
   * Fetches assigned projects for the student's team
   */
  getMyProjects: async () => {
    const response = await axiosClient.get(ENDPOINTS.PROJECTS.GET_MY_PROJECTS);
    return response?.projects || [];
  },
};
