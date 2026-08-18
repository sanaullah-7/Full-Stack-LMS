/**
 * Task service layer — wraps Axios task API.
 * UI → task.services → task.api → Express → MongoDB
 */
import {
  getTasks as apiGetTasks,
  getTask as apiGetTask,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "../api/task.api";

export const getTasks = () => apiGetTasks();
export const getTask = (id) => apiGetTask(id);
export const createTask = (payload) => apiCreateTask(payload);
export const updateTask = (id, payload) => apiUpdateTask(id, payload);
export const deleteTask = (id) => apiDeleteTask(id);
