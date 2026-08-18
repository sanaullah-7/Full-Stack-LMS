import api from "../api/axios";

const ENDPOINT = "/api/teams";

export async function fetchTeams() {
  try {
    const res = await api.get(ENDPOINT);
    return res.data.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch teams", {
      cause: error,
    });
  }
}

export async function fetchTeamById(teamId) {
  try {
    const res = await api.get(`${ENDPOINT}/${teamId}`);
    return res.data.data || null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw new Error(error.response?.data?.message || "Failed to fetch team", {
      cause: error,
    });
  }
}

export async function createTeam(team) {
  try {
    const res = await api.post(ENDPOINT, team);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create team", {
      cause: error,
    });
  }
}

export async function updateTeam(teamId, teamData) {
  try {
    const res = await api.put(`${ENDPOINT}/${teamId}`, teamData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update team", {
      cause: error,
    });
  }
}

/** DELETE /api/teams/:id — deletes team in MongoDB (existing backend). */
export async function deleteTeam(teamId) {
  try {
    const res = await api.delete(`${ENDPOINT}/${teamId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete team", {
      cause: error,
    });
  }
}

export async function addMemberToTeam(teamId, studentId) {
  try {
    const res = await api.post(`${ENDPOINT}/${teamId}/members/${studentId}`, {});
    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add member to team",
      { cause: error },
    );
  }
}

export async function removeMemberFromTeam(teamId, studentId) {
  try {
    const res = await api.delete(`${ENDPOINT}/${teamId}/members/${studentId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove member from team",
      { cause: error },
    );
  }
}

export async function removeSelectedMembersFromTeam(teamId, studentIds) {
  try {
    const res = await api.delete(`${ENDPOINT}/${teamId}/members`, {
      data: { studentIds },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove members from team",
      { cause: error },
    );
  }
}

export async function fetchUnassignedStudents() {
  try {
    const res = await api.get(`${ENDPOINT}/unassigned-students`);
    return res.data.data || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch unassigned students",
      { cause: error },
    );
  }
}
