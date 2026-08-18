/** Canonical Task statuses from Server/models/taskModel.js */
import {
  ListTodo,
  Clock3,
  Loader,
  CheckCircle2,
} from "lucide-react";

export const TASK_STATUSES = ["Pending", "In Progress", "Completed"];

export const TASK_FILTERS = [
  {
    key: "all",
    label: "All Tasks",
    icon: ListTodo,
    tone: "text-[var(--color-primary)]",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    tone: "text-[var(--color-secondary)]",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Loader,
    tone: "text-[var(--color-warning)]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    tone: "text-[var(--color-success)]",
  },
];

export function normalizeTaskStatus(status) {
  const key = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (key === "in_progress") return "In Progress";
  if (key === "completed") return "Completed";
  if (key === "pending" || key === "to_do" || key === "not_started") {
    return "Pending";
  }
  // Already Title Case from API
  if (TASK_STATUSES.includes(status)) return status;
  return "Pending";
}

export function taskStatusKey(status) {
  return normalizeTaskStatus(status)
    .toLowerCase()
    .replace(/\s+/g, "_");
}
