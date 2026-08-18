import { FolderKanban, Users, ChevronRight } from "lucide-react";

function formatDeadline(value) {
  if (!value) return "No deadline";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "No deadline";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const StudentTeamsProjects = ({ team = null, projects = [] }) => {
  const members = team?.members || [];
  const projectList = projects?.length ? projects : team?.projects || [];

  return (
    <div className="app-panel flex h-full w-full shrink-0 flex-col p-6 lg:w-[400px]">
      <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight mb-6">
        Teams & Projects
      </h3>

      {!team ? (
        <div className="py-6 text-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-low)]">
          <p className="text-sm text-[var(--color-text-muted)]">No team assigned</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-low)]">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-[#e0f2fe] text-[#2563eb]">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--color-text)] truncate">
                {team.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {members.length} member{members.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {members.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                Team Members
              </p>
              <ul className="space-y-1.5 max-h-28 overflow-y-auto">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="text-sm text-[var(--color-text)] flex items-center justify-between gap-2"
                  >
                    <span className="truncate font-medium">{m.name}</span>
                    <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                      {m.rollNumber}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Projects
            </p>
            {projectList.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-2">
                No projects assigned
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {projectList.map((project) => (
                  <div
                    key={project.id}
                    className="group flex items-center justify-between p-4 border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-low)] transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-[#e0f2fe] text-[#2563eb]">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[var(--color-text)] truncate">
                          {project.title}
                        </span>
                        <span className="text-xs font-medium text-[var(--color-text-muted)] mt-0.5 truncate">
                          {project.status} · {formatDeadline(project.dueDate)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTeamsProjects;
