import { useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Search } from "lucide-react";
import toast from "react-hot-toast";
import ProjectCard from "../../components/team/ProjectCard";
import MemberCard from "../../components/team/MemberCrad";
import {
  fetchTeamById,
  addMemberToTeam,
  removeMemberFromTeam,
  fetchUnassignedStudents,
  deleteTeam,
} from "../../Data/teams";
import { deleteProject } from "../../Data/projects";
import { getStudentData } from "../../api/axios";
import { getTeamProjects } from "../../components/team/deriveTeamStatus";
import TeamDetailSkeleton from "./TeamDetailSkeleton";

function TrashIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function toId(value) {
  if (value == null) return null;
  if (typeof value === "object") return String(value._id || value.id || value);
  return String(value);
}

function hasTeamAssigned(student) {
  const tid = student?.team_id;
  if (tid == null || tid === "") return false;
  return true;
}

async function loadUnassignedStudents() {
  try {
    const list = await fetchUnassignedStudents();
    return Array.isArray(list) ? list : [];
  } catch {
    const res = await getStudentData().catch(() => ({ students: [] }));
    const list = res?.students || res?.data || [];
    if (!Array.isArray(list)) return [];
    return list.filter((s) => !hasTeamAssigned(s));
  }
}

export default function TeamDetails({ teamId, onClose, onTeamUpdated }) {
  const [team, setTeam] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(false);
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);

  const loadTeam = useCallback(async () => {
    const data = await fetchTeamById(teamId);
    setTeam(data);
    return data;
  }, [teamId]);

  const refreshTeamAndStudents = useCallback(async () => {
    const [freshTeam, freshUnassigned] = await Promise.all([
      fetchTeamById(teamId),
      loadUnassignedStudents(),
    ]);
    setTeam(freshTeam);
    setAllStudents(freshUnassigned);
    await onTeamUpdated?.();
    return freshTeam;
  }, [teamId, onTeamUpdated]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [teamData, unassignedStudents] = await Promise.all([
          fetchTeamById(teamId),
          loadUnassignedStudents(),
        ]);
        if (isMounted) {
          setTeam(teamData);
          setAllStudents(unassignedStudents);
        }
      } catch (err) {
        if (isMounted) setError(err.message ?? "Unknown error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [teamId]);

  const projects = getTeamProjects(team);
  const members = team?.members ?? [];

  const availableStudents = useMemo(() => {
    const currentMembers = team?.members ?? [];
    const memberIds = new Set(
      currentMembers.map((m) => toId(m._id || m.id)).filter(Boolean),
    );
    return allStudents.filter((s) => {
      const id = toId(s._id || s.id);
      if (!id || memberIds.has(id)) return false;
      return !hasTeamAssigned(s);
    });
  }, [allStudents, team?.members]);

  const filteredAvailableStudents = useMemo(() => {
    const q = memberSearchQuery.trim().toLowerCase();
    if (!q) return availableStudents;
    return availableStudents.filter((s) => {
      const name = String(s.name || "").toLowerCase();
      const roll = String(s.rollNumber || "").toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [availableStudents, memberSearchQuery]);

  async function handleAddMember() {
    if (selectedStudentIds.length === 0 || isUpdating) return;

    const memberIds = new Set(
      members.map((m) => toId(m._id || m.id)).filter(Boolean),
    );

    // Client-side duplicate guard (backend also validates)
    const toAdd = [];
    for (const studentId of selectedStudentIds) {
      const sid = toId(studentId);
      if (!sid) continue;
      if (memberIds.has(sid)) {
        toast.error("Student is already a member of this team");
        continue;
      }
      toAdd.push(sid);
    }

    if (toAdd.length === 0) {
      setSelectedStudentIds([]);
      return;
    }

    setIsUpdating(true);
    try {
      for (const studentId of toAdd) {
        await addMemberToTeam(teamId, studentId);
      }
      toast.success(
        toAdd.length === 1
          ? "Member added successfully"
          : "Members added successfully",
      );
      setSelectedStudentIds([]);
      setMemberSearchQuery("");
      // Full refresh — keeps existing members + newly added (never replaces list)
      await refreshTeamAndStudents();
    } catch (err) {
      toast.error(err.message || "Failed to add member");
      // Still refresh so UI matches server if partial success
      try {
        await refreshTeamAndStudents();
      } catch {
        /* ignore */
      }
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemoveMember(memberIdToRemove) {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await removeMemberFromTeam(teamId, memberIdToRemove);
      await refreshTeamAndStudents();
    } catch (err) {
      toast.error(err.message || "Failed to remove member");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleConfirmDeleteProject() {
    if (!projectToDelete) return;
    const projectId = projectToDelete._id || projectToDelete.id;
    if (!projectId) {
      toast.error("Project id is missing");
      return;
    }

    setIsDeletingProject(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      setProjectToDelete(null);
      await loadTeam();
      await onTeamUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setIsDeletingProject(false);
    }
  }

  async function handleConfirmDeleteTeam() {
    if (!teamId || isDeletingTeam) return;

    setIsDeletingTeam(true);
    try {
      // Real backend: DELETE /api/teams/:id
      await deleteTeam(teamId);
      toast.success("Team deleted successfully");
      setConfirmDeleteTeam(false);
      onClose();
      // Re-fetch teams from backend (source of truth)
      await onTeamUpdated?.();
    } catch (err) {
      // Keep modal open; do not remove team from UI
      toast.error(err.message || "Failed to delete team");
    } finally {
      setIsDeletingTeam(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-lg"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-[900px] flex flex-col max-h-[92dvh] sm:max-h-[90vh] overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact sticky header */}
        <div className="flex justify-between items-center px-md py-sm border-b border-border bg-surface shrink-0 gap-sm">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-weight-bold text-text truncate">
              {team ? team.name : "Team Details"}
            </h1>
            {team && (
              <p className="text-xs text-text-muted mt-0.5 truncate">
                Manage team members and view assigned projects
              </p>
            )}
          </div>
          <div className="flex items-center gap-sm shrink-0">
            {team && (
              <button
                type="button"
                onClick={() => setConfirmDeleteTeam(true)}
                disabled={isDeletingTeam || isUpdating}
                className="inline-flex items-center gap-xs px-sm py-1.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                aria-label="Delete team"
                title="Delete team"
              >
                <TrashIcon size={16} />
                <span className="hidden sm:inline">Delete Team</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-sm hover:bg-surface-high rounded-full transition-colors text-text-muted hover:text-text"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-md py-md overflow-y-auto flex-1 min-h-0 bg-background">
          {isLoading && <TeamDetailSkeleton />}

          {!isLoading && error && (
            <div className="bg-error/10 text-error p-md rounded-lg text-sm mb-md border border-error/20">
              Failed to load team: {error}
            </div>
          )}

          {!isLoading && !error && !team && (
            <div className="text-center py-12 bg-surface rounded-xl border border-border">
              <p className="text-sm font-medium text-text-muted">
                Team not found. It may have been deleted.
              </p>
            </div>
          )}

          {!isLoading && !error && team && (
            <div className="flex flex-col gap-md">
              {/* Assigned Projects — previous section style */}
              <section className="bg-surface rounded-xl border border-border p-md shadow-sm">
                <div className="flex items-center justify-between mb-sm">
                  <h2 className="text-base font-weight-bold text-text">
                    Assigned Projects ({projects.length})
                  </h2>
                </div>

                {projects.length === 0 ? (
                  <div className="py-6 text-center bg-surface-low rounded-lg border border-dashed border-border">
                    <p className="text-sm text-text-muted">No projects assigned</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project._id ?? project.id ?? project.title}
                        project={project}
                        variant="card"
                        hideEdit
                        onDelete={(p) => setProjectToDelete(p)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Team Members — previous side-by-side add UI */}
              <section className="bg-surface rounded-xl border border-border p-md shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-md mb-sm">
                  <h2 className="text-base font-weight-bold text-text">
                    Members ({members.length})
                  </h2>

                  <div className="flex flex-col gap-sm items-stretch w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]">
                    <div className="relative w-full">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                        <Search className="h-3.5 w-3.5 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        placeholder="Search by name or roll no..."
                        aria-label="Search students by name or roll number"
                        disabled={isUpdating || availableStudents.length === 0}
                        className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-surface-low">
                      {availableStudents.length === 0 ? (
                        <p className="text-sm text-text-muted p-2 text-center">
                          No available students
                        </p>
                      ) : filteredAvailableStudents.length === 0 ? (
                        <p className="text-sm text-text-muted p-2 text-center">
                          No students match your search
                        </p>
                      ) : (
                        filteredAvailableStudents.map((student) => {
                          const id = toId(student._id || student.id);
                          return (
                            <label
                              key={id}
                              className="flex items-center gap-3 p-2 hover:bg-surface rounded-md cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStudentIds.includes(id)}
                                disabled={isUpdating}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIds((prev) =>
                                      prev.includes(id) ? prev : [...prev, id],
                                    );
                                  } else {
                                    setSelectedStudentIds((prev) =>
                                      prev.filter((x) => x !== id),
                                    );
                                  }
                                }}
                                className="w-4 h-4 accent-primary rounded border-border shrink-0"
                              />
                              <span className="text-sm font-medium text-text truncate">
                                {student.name}{" "}
                                <span className="text-text-muted font-normal">
                                  ({student.rollNumber})
                                </span>
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={selectedStudentIds.length === 0 || isUpdating}
                      className="bg-primary text-white px-lg py-sm rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full"
                    >
                      {isUpdating
                        ? "Adding..."
                        : `Add Selected (${selectedStudentIds.length})`}
                    </button>
                  </div>
                </div>

                {members.length === 0 ? (
                  <div className="py-6 text-center bg-surface-low rounded-lg border border-dashed border-border">
                    <p className="text-sm text-text-muted">No members assigned</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                    {members.map((member) => (
                      <MemberCard
                        key={member._id ?? member.id ?? member.email}
                        member={member}
                        onRemove={handleRemoveMember}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Compact footer */}
        <div className="flex justify-end gap-sm px-md py-sm border-t border-border bg-surface shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-lg py-sm rounded-lg text-sm font-medium text-on-primary bg-primary hover:bg-on-primary-container transition-colors duration-fast"
          >
            Close
          </button>
        </div>
      </div>

      {projectToDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !isDeletingProject && setProjectToDelete(null)}
        >
          <div
            className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-[220px] p-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-sm">
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={() => setProjectToDelete(null)}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-text-muted bg-surface-container hover:bg-surface-high disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={handleConfirmDeleteProject}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-white bg-error hover:opacity-90 disabled:opacity-60"
              >
                {isDeletingProject ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple team delete confirm: Delete + Cancel only */}
      {confirmDeleteTeam && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !isDeletingTeam && setConfirmDeleteTeam(false)}
        >
          <div
            className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-[220px] p-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-sm">
              <button
                type="button"
                disabled={isDeletingTeam}
                onClick={() => setConfirmDeleteTeam(false)}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-text-muted bg-surface-container hover:bg-surface-high disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingTeam}
                onClick={handleConfirmDeleteTeam}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-white bg-error hover:opacity-90 disabled:opacity-60"
              >
                {isDeletingTeam ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
