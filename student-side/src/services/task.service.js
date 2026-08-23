import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Tasks and Assignment Service
 */
export const taskService = {
  /**
   * Fetches all tasks assigned to the student
   * @param {Object} params - { status, sortBy }
   */
  getTasks: async (params = {}) => {
    return await axiosClient.get(ENDPOINTS.TASKS.GET_ALL, { params });
  },

  /**
   * Fetches single task details by ID
   * @param {string} taskId
   */
  getTaskById: async (taskId) => {
    return await axiosClient.get(ENDPOINTS.TASKS.GET_BY_ID(taskId));
  },

  /**
   * Submits student work for a specific task
   * @param {string} taskId
   * @param {Object} payload - { submissionUrl: string, notes: string }
   */
  submitTask: async (taskId, payload) => {
    return await axiosClient.post(ENDPOINTS.TASKS.SUBMIT(taskId), payload);
  },
};
