import { LuPencil, LuTrash2 } from "react-icons/lu";
import StatusBadge from "../../components/team/StatusBadge";

function formatDeadline(isoDate) {
  if (!isoDate) return "No deadline set";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat("en-CA").format(date);
}

/**
 * ProjectCard
 * - variant="row" (default): table row for Projects page
 * - variant="card": card for View Team Assigned Projects
 * - hideEdit: hide Edit (View Team uses true; keeps Delete)
 */
export default function ProjectCard({
  project,
  teamName,
  onEdit,
  onDelete,
  variant = "row",
  hideEdit = false,
}) {
  const { title, description, deadline, dueDate } = project;
  const status = project.status;
  const deadlineLabel = formatDeadline(dueDate || deadline);

  const actionButtons = (
    <div className="inline-flex items-center justify-end gap-2">
      {!hideEdit && (
        <button
          type="button"
          onClick={() => onEdit?.(project)}
          aria-label="Edit project"
          className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 cursor-pointer transition-colors"
        >
          <LuPencil className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete?.(project)}
        aria-label="Delete project"
        className="p-1.5 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error)]/10 cursor-pointer transition-colors"
      >
        <LuTrash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (variant === "card") {
    return (
      <div className="bg-surface-low border border-border rounded-lg p-md flex flex-col gap-sm min-w-0">
        <div className="flex items-start justify-between gap-sm">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-weight-semibold text-text break-words">{title}</h4>
            {description ? (
              <p className="text-xs text-text-muted mt-xs line-clamp-2 break-words">{description}</p>
            ) : null}
          </div>
          <div className="shrink-0">{actionButtons}</div>
        </div>
        <div className="flex items-center justify-between gap-sm">
          <StatusBadge status={status} />
          <span className="text-xs text-text-muted truncate">{deadlineLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-border last:border-b-0 transition-colors duration-fast hover:bg-[color-mix(in_srgb,var(--color-primary)_4%,var(--color-surface))]">
      <td className="px-4 py-4 align-middle min-w-0">
        <p className="text-sm font-bold text-text break-words line-clamp-2">{title}</p>
        {description && (
          <p className="text-xs text-text-muted mt-xs break-words line-clamp-2">{description}</p>
        )}
      </td>

      <td className="px-4 py-4 align-middle text-sm text-text-muted min-w-0">
        <span className="break-words line-clamp-2">
          {teamName ?? project.teamId?.name ?? project.team?.name ?? project.teamName ?? "—"}
        </span>
      </td>

      <td className="px-4 py-4 align-middle">
        <StatusBadge status={status} />
      </td>

      <td className="px-4 py-4 align-middle text-sm text-text-muted whitespace-nowrap">
        {deadlineLabel}
      </td>

      <td className="px-4 py-4 align-middle text-right">
        {actionButtons}
      </td>
    </tr>
  );
}
