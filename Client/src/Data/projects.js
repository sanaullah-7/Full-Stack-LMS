import api from "../api/axios";

const ENDPOINT = "/api/projects";

export async function fetchProjects() {
  try {
    const res = await api.get(ENDPOINT);
    return res.data.projects || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch projects",
      { cause: error },
    );
  }
}

export async function fetchProjectById(projectId) {
  try {
    const res = await api.get(`${ENDPOINT}/${projectId}`);
    return res.data.project || null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw new Error(
      error.response?.data?.message || "Failed to fetch project",
      { cause: error },
    );
  }
}

export async function createProject(projectData) {
  try {
    const res = await api.post(ENDPOINT, projectData);
    return res.data.project;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create project",
      { cause: error },
    );
  }
}

export async function updateProject(projectId, updateData) {
  try {
    const res = await api.put(`${ENDPOINT}/${projectId}`, updateData);
    return res.data.project;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update project",
      { cause: error },
    );
  }
}

export async function deleteProject(projectId) {
  try {
    const res = await api.delete(`${ENDPOINT}/${projectId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete project",
      { cause: error },
    );
  }
}
