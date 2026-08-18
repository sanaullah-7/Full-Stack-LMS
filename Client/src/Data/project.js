import api from "../api/axios";

const ENDPOINT = "/api/projects";

const normalizeProject = (project) => {
  return {
    id: project._id,
    title: project.title,
    description: project.description,
    deadline: project.dueDate,
    status: project.status,
    progress: project.progress ?? 0,
    teamId: project.teamId?._id ?? project.teamId,
  };
};

export const fetchProjects = async () => {
  try {
    const response = await api.get(ENDPOINT);

    return (response.data.projects || []).map(normalizeProject);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch projects",
      { cause: error },
    );
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const response = await api.get(
      `${ENDPOINT}/${projectId}`
    );

    return normalizeProject(response.data.project);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch project",
      { cause: error },
    );
  }
};
