import api from "../api/axios";

// Get dashboard statistics
export const getDashboardStats = async (dateStr) => {
  const params = dateStr ? { date: dateStr } : {};
  const response = await api.get("/api/dashboard/stats", { params });
  return response.data;
};
