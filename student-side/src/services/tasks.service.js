import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Student Tasks and Assignments Service
 */
export const tasksService = {
  /**
   * Fetches all tasks assigned to the logged-in student
   */
  getTasks: async () => {
    const response = await axiosClient.get(ENDPOINTS.TASKS.GET_ALL);
    return response?.tasks || [];
  },

  /**
   * Updates task status (e.g., 'Pending', 'In Progress', 'Completed')
   * @param {string} taskId
   * @param {string} status - 'Pending' | 'In Progress' | 'Completed'
   */
  updateTaskStatus: async (taskId, status) => {
    return await axiosClient.patch(ENDPOINTS.TASKS.UPDATE_STATUS, {
      taskId,
      status,
    });
  },

  /**
   * Submits/completes a task with submission details
   * @param {string} taskId
   * @param {Object} submissionData - { link: string, description: string }
   */
  submitTask: async (taskId, submissionData) => {
    const response = await axiosClient.patch(ENDPOINTS.TASKS.UPDATE_STATUS, {
      taskId,
      status: "Completed",
    });
    return response?.data || response;
  },
};

export const taskService = tasksService;
