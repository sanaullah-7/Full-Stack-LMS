import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProjectById, updateProject } from "../../Data/projects";
import { fetchTeams } from "../../Data/teams";
import Skeleton from "../../components/ui/Skeleton";

function EditProjectFormSkeleton() {
  return (
    <div className="flex flex-col gap-md" aria-busy="true" aria-label="Loading project">
      <div>
        <Skeleton className="h-3.5 w-24 mb-xs" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-3.5 w-28 mb-xs" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-3.5 w-20 mb-xs" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-3.5 w-16 mb-xs" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-3.5 w-28 mb-xs" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Under Review", label: "Under Review" },
  { value: "Completed", label: "Completed" },
];

function toDateInputValue(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  status: "Not Started",
  teamId: "",
};

export default function ProjectDetailsModal({ projectId, onClose, onUpdate }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProject, setHasProject] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);
      setFormError(null);
      setHasProject(false);
      try {
        const [projectData, teamsData] = await Promise.all([
          fetchProjectById(projectId),
          fetchTeams(),
        ]);
        if (!isMounted) return;

        if (!projectData) {
          setLoadError("Project not found");
          setFormData(EMPTY_FORM);
        } else {
          const teamId =
            projectData.teamId?._id || projectData.teamId || "";
          setFormData({
            title: projectData.title || "",
            description: projectData.description || "",
            dueDate: toDateInputValue(projectData.dueDate),
            status: projectData.status || "Not Started",
            teamId: teamId ? String(teamId) : "",
          });
          setHasProject(true);
        }
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (err) {
        if (isMounted) setLoadError(err.message ?? "Unknown error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (projectId) loadData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleClose() {
    if (isSubmitting) return;
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      setFormError("Project title is required.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate || null,
      teamId: formData.teamId || null,
    };

    setIsSubmitting(true);
    setFormError(null);
    try {
      await updateProject(projectId, payload);
      toast.success("Project updated successfully");
      if (onUpdate) await onUpdate();
      onClose();
    } catch (err) {
      const message = err.message || "Failed to update project";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface rounded-xl shadow-md w-full max-w-[520px] flex flex-col max-h-[90vh] overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-lg py-md border-b border-border shrink-0">
          <h2 className="text-lg font-weight-semibold text-text">Edit Project</h2>
        </div>

        <div className="p-lg overflow-y-auto flex-1 min-h-0">
          {isLoading && <EditProjectFormSkeleton />}

          {!isLoading && loadError && (
            <div className="bg-error/10 text-error p-md rounded-lg text-sm border border-error/20">
              {loadError}
            </div>
          )}

          {!isLoading && hasProject && (
            <form
              id="edit-project-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-md"
            >
              <div>
                <label className="text-sm font-weight-medium text-text mb-xs block">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-sm font-weight-medium text-text mb-xs block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-sm font-weight-medium text-text mb-xs block">
                  Deadline
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-sm font-weight-medium text-text mb-xs block">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-weight-medium text-text mb-xs block">
                  Assigned Team
                </label>
                <select
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-60"
                >
                  <option value="">-- Unassigned --</option>
                  {teams.map((team) => (
                    <option
                      key={team._id || team.id}
                      value={team._id || team.id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {formError ? (
                <p className="text-sm text-error">{formError}</p>
              ) : null}
            </form>
          )}
        </div>

        <div className="flex justify-end gap-sm px-lg py-md border-t border-border bg-surface shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-lg py-sm rounded-lg text-sm font-weight-medium text-text-muted bg-surface-container hover:bg-surface-high transition-colors duration-fast disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-project-form"
            disabled={isLoading || isSubmitting || !hasProject}
            className="px-lg py-sm rounded-lg text-sm font-weight-medium text-on-primary bg-primary hover:opacity-90 disabled:opacity-60 transition-opacity duration-fast"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
