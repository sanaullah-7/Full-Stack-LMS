import api from "../api/axios";

// Get All Teams
export const getAllTeams = async () => {
  const response = await api.get("/api/teams");
  return response.data.data;
};

// Get Team By Id
export const getTeamById = async (id) => {
  const response = await api.get(`/api/teams/${id}`);
  return response.data.data;
};

// Create Team
export const createTeam = async (teamData) => {
  const response = await api.post("/api/teams", teamData);
  return response.data.data;
};

// Update Team
export const updateTeam = async (id, teamData) => {
  const response = await api.put(`/api/teams/${id}`, teamData);
  return response.data.data;
};

// Delete Team
export const deleteTeam = async (id) => {
  const response = await api.delete(`/api/teams/${id}`);
  return response.data;
};

// Add Member
export const addMember = async (teamId, studentId) => {
  const response = await api.post(`/api/teams/${teamId}/members/${studentId}`);
  return response.data.data;
};

// Remove Member
export const removeMember = async (teamId, studentId) => {
  const response = await api.delete(
    `/api/teams/${teamId}/members/${studentId}`
  );
  return response.data.data;
};

// Remove Multiple Members
export const removeSelectedMembers = async (teamId, studentIds) => {
  const response = await api.delete(`/api/teams/${teamId}/members`, {
    data: { studentIds },
  });

  return response.data.data;
};

// Get Team By Project
export const getTeamByProject = async (projectId) => {
  const response = await api.get(`/api/teams/project/${projectId}`);
  return response.data.data;
};

// Get Unassigned Teams
export const getUnassignedTeams = async () => {
  const response = await api.get("/api/teams/unassigned");
  return response.data.data;
};

// Get Unassigned Students
export const getUnassignedStudents = async () => {
  const response = await api.get("/api/teams/unassigned-students");
  return response.data.data;
};