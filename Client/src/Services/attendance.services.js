import api from "../api/axios.js";


// Mark / Update Attendance
export const markAttendance = async (data) => {
  const response = await api.post("/api/attendance", data);

  return response.data;
};


// Get Attendance By Date
export const getAttendanceByDate = async (date) => {
  const response = await api.get(`/api/attendance/${date}`);

  return response.data;
};


// Get Student Attendance History
export const getStudentAttendanceHistory = async (studentId) => {
  const response = await api.get(`/api/attendance/student/${studentId}`);

  return response.data;
};


// Get Overall Attendance Stats
export const getOverallAttendanceStats = async () => {
  const response = await api.get("/api/attendance/stats/overall");

  return response.data;
};