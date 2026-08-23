import axios from "axios";
import { clearAuthToken, getAuthToken } from "../utils/authToken";

const CLIENT_APP_SECRET = "saylani-lms-client-v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "X-App-Client": CLIENT_APP_SECRET,
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers["X-App-Client"] = CLIENT_APP_SECRET;
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export const getStudentData = async () => {
  const response = await api.get("/api/student");
  return response.data;
};

export const getTeamData = async () => {
  const response = await api.get("/api/teams");
  return response.data;
};

export const getTaskData = async () => {
  const response = await api.get("/api/tasks");
  return response.data;
};

export const getPendingTaskData = async () => {
  const response = await api.get("/api/tasks?status=pending");
  return response.data;
};

export const getDashboardStats = async (dateStr) => {
  const params = dateStr ? { date: dateStr } : {};
  const response = await api.get("/api/dashboard/stats", { params });
  return response.data;
};

export default api;
