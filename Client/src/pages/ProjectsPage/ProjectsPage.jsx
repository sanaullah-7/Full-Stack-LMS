import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FolderKanban,
  CircleDashed,
  Loader,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "../../Data/projects";
import FilterToolbar from "../../components/team/FilterTollbar";
import ProjectCard from "../../components/team/ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import PageShell, { PagePanel } from "../../components/ui/PageShell";

/** Matches Project model status enum (Title Case) + filter keys. */
const PROJECT_FILTERS = [
  {
    key: "all",
    label: "All Projects",
    icon: FolderKanban,
    tone: "text-[var(--color-primary)]",
  },
  {
    key: "not_started",
    label: "Not Started",
    icon: CircleDashed,
    tone: "text-[var(--color-text-muted)]",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Loader,
    tone: "text-[var(--color-warning)]",
  },
  {
    key: "under_review",
    label: "Under Review",
    icon: Eye,
    tone: "text-[var(--color-secondary)]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    tone: "text-[var(--color-success)]",
  },
];

function matchesProjectStatus(status, filterKey) {
  if (filterKey === "all") return true;
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  return normalized === filterKey;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const handleOpenCreateProjectModal = () => {
      setIsCreateModalOpen(true);
    };
    window.addEventListener(
      "openCreateProjectModal",
      handleOpenCreateProjectModal,
    );
    return () => {
      window.removeEventListener(
        "openCreateProjectModal",
        handleOpenCreateProjectModal,
      );
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: projects.length,
      not_started: projects.filter((p) =>
        matchesProjectStatus(p.status, "not_started"),
      ).length,
      in_progress: projects.filter((p) =>
        matchesProjectStatus(p.status, "in_progress"),
      ).length,
      under_review: projects.filter((p) =>
        matchesProjectStatus(p.status, "under_review"),
      ).length,
      completed: projects.filter((p) =>
        matchesProjectStatus(p.status, "completed"),
      ).length,
    }),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = matchesProjectStatus(project.status, activeFilter);

      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  function handleEditProject(project) {
    setSelectedProjectId(project._id || project.id);
  }

  function handleDeleteClick(project) {
    setProjectToDelete(project);
  }

  async function handleConfirmDelete() {
    if (!projectToDelete || isDeleting) return;
    const projectId = projectToDelete._id || projectToDelete.id;
    if (!projectId) {
      toast.error("Project id is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      setProjectToDelete(null);
      await loadProjects();
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCreateProject(newProject) {
    await createProject(newProject);
    await loadProjects();
  }

  return (
    <PageShell>
      <FilterToolbar
        filters={PROJECT_FILTERS}
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects..."
        isLoading={isLoading}
      />

      {isLoading ? (
        <ProjectTableSkeleton />
      ) : error ? (
        <PagePanel className="py-10 text-center text-error">{error}</PagePanel>
      ) : filteredProjects.length === 0 ? (
        <PagePanel className="py-10 text-center text-text-muted">
          No projects found.
        </PagePanel>
      ) : (
        <PagePanel padded={false} className="overflow-x-auto">
          <table className="w-full table-fixed text-left min-w-[720px] border-collapse">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-[var(--color-surface-low)]/90">
                <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle">
                  Project
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle">
                  Team
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle">
                  Status
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle">
                  Deadline
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  teamName={project.teamId?.name || project.teamName}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </PagePanel>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {selectedProjectId && (
        <ProjectDetailsModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
          onUpdate={loadProjects}
        />
      )}

      {projectToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !isDeleting && setProjectToDelete(null)}
        >
          <div
            className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-[220px] p-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-sm">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-text-muted bg-surface-container hover:bg-surface-high disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-md py-1.5 rounded-lg text-sm font-medium text-white bg-error hover:opacity-90 disabled:opacity-60"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
