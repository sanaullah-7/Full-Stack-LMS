/**
 * Derive a display status from assigned projects.
 * Uses backend Project.status values (Title Case).
 */

export function normalizeProjectStatusKey(status) {
  if (status == null || status === "") return "not_started";
  return String(status).trim().toLowerCase().replace(/\s+/g, "_");
}

/**
 * @param {Array<{ status?: string }>} projects
 * @returns {"Not Started"|"In Progress"|"Under Review"|"Completed"}
 */
export function deriveTeamStatusFromProjects(projects = []) {
  if (!projects?.length) return "Not Started";

  const keys = projects.map((p) => normalizeProjectStatusKey(p?.status));

  if (keys.some((k) => k === "in_progress")) return "In Progress";
  if (keys.some((k) => k === "under_review")) return "Under Review";
  if (keys.every((k) => k === "completed")) return "Completed";

  return "Not Started";
}

export function getTeamProjects(team) {
  if (!team) return [];
  if (team.projects?.length) return team.projects;
  if (team.project) return [team.project];
  return [];
}
