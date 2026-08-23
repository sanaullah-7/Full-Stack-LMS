import { ClipboardCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { DashboardTasksSkeleton } from "../../components/dashboard/DashboardSkeleton";

const taskStatusStyles = {
  Completed:
    " text-[var(--color-success)] border border-[var(--color-success)]/20",
  "In Progress":
    "text-[var(--color-warning)] border border-[var(--color-warning)]/20",
  Pending:
    "text-[var(--color-secondary)] border border-[var(--color-secondary)]/20",
};

function TaskRow({ title, student, rollNumber, teamName, dueDate, status }) {
  const teamLabel = teamName || "Unassigned";

  return (
    <div className="rounded-[var(--radius-lg)] border border-transparent px-2.5 py-3 transition-all duration-[var(--duration-fast)] last:border-b-0 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-low)] hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p
          className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-[var(--color-text)] break-words"
          title={title}
        >
          {title}
        </p>
        <span
          className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-none ${taskStatusStyles[status] || taskStatusStyles.Pending}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-[11px] leading-snug text-[var(--color-text-muted)]">
        <p className="truncate font-semibold text-[var(--color-text)]" title={student}>
          {student}
        </p>
        <p className="truncate" title={`Roll ${rollNumber}`}>
          Roll {rollNumber}
        </p>
        <p
          className="truncate font-semibold text-[var(--color-primary)]"
          title={`Team: ${teamLabel}`}
        >
          Team: {teamLabel}
        </p>
        <p className="truncate" title={`Due ${dueDate}`}>
          Due {dueDate}
        </p>
      </div>
    </div>
  );
}

export default function TaskSummary({ task, isLoading }) {
  return (
    <div className="app-panel flex max-h-[28rem] w-full min-w-0 flex-col overflow-hidden p-4 sm:p-5 lg:col-span-1 lg:self-start">
      <div className="mb-2 flex shrink-0 items-start justify-between gap-2 border-b border-[var(--color-surface-high)] pb-2">
        <div className="flex min-w-0 items-center gap-[var(--spacing-sm)]">
          <div className="shrink-0 rounded-lg p-1 text-[var(--color-primary)]">
            <ClipboardCheck size={20} strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold leading-snug text-[var(--color-text)] sm:text-base">
            Today&apos;s Task Summary
          </h2>
        </div>
        <NavLink
          to="/tasks"
          className="shrink-0 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Manage
        </NavLink>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <DashboardTasksSkeleton />
        ) : task.length ? (
          task.map((item) => (
            <TaskRow
              key={item._id}
              title={item.title}
              student={item.studentId.name}
              rollNumber={item.studentId.rollNumber ?? "--"}
              teamName={item.studentId.team_id?.name || null}
              dueDate={item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "--"}
              status={item.status?.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Pending"}
            />
          ))
        ) : (
          <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">
            No tasks found for today.
          </p>
        )}
      </div>
    </div>
  );
}