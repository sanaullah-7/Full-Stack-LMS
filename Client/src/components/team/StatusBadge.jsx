/**
 * Backend Project.status enum (project.Model.js):
 *   'Not Started' | 'In Progress' | 'Under Review' | 'Completed'
 *
 * Team.status uses snake_case:
 *   not_started | in_progress | completed
 */

const STATUS_STYLES = {
  "Not Started": {
    label: "Not Started",
    className: "bg-surface-container text-text-muted border border-border",
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  "Under Review": {
    label: "Under Review",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  Completed: {
    label: "Completed",
    className: "bg-success/10 text-success border border-success/20",
  },
  not_started: {
    label: "Not Started",
    className: "bg-surface-container text-text-muted border border-border",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border border-success/20",
  },
};

function resolveStyle(status) {
  if (status == null || status === "") {
    return null;
  }

  const raw = String(status).trim();
  if (STATUS_STYLES[raw]) return STATUS_STYLES[raw];

  const snake = raw.toLowerCase().replace(/\s+/g, "_");
  if (STATUS_STYLES[snake]) return STATUS_STYLES[snake];

  return {
    label: raw,
    className: "bg-surface-container text-text-muted border border-border",
  };
}

export default function StatusBadge({ status }) {
  const style = resolveStyle(status);

  if (!style) {
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold leading-none ${style.className}`}
    >
      {style.label}
    </span>
  );
}
