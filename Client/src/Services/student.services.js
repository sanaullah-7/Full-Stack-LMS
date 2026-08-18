import api from "../api/axios";

// Get all students / search
export const getStudents = async (searchQuery = "") => {
  const params = searchQuery ? { search: searchQuery } : {};
  const response = await api.get("/api/student", { params });
  return response.data;
};

// Get single student by ID
export const getStudentById = async (id) => {
  const response = await api.get(`/api/student/${id}`);
  return response.data;
};

// Full dynamic student profile
export const getStudentProfile = async (id) => {
  const response = await api.get(`/api/student/${id}/profile`);
  return response.data;
};

// Create new student
export const createStudent = async (studentData) => {
  const response = await api.post("/api/student", studentData);
  return response.data;
};

// Update student
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/api/student/${id}`, studentData);
  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await api.delete(`/api/student/${id}`);
  return response.data;
};
