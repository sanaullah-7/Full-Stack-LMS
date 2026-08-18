import { useState, useEffect } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPencil,
  LuTrash2,
  LuSearch,
} from "react-icons/lu";
import { normalizeTaskStatus } from "../../utils/taskStatus";
import TaskTableSkeleton from "./TaskTableSkeleton";
import CustomSelect from "../CustomSelect";

const StatusBadge = ({ status }) => {
  const normalized = normalizeTaskStatus(status);
  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
  if (normalized === "In Progress") {
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalized === "Completed") {
    badgeStyle = "bg-green-50 text-green-700 border-green-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${badgeStyle}`}
    >
      {normalized}
    </span>
  );
};

const TaskTable = ({
  externalTasks,
  loading,
  onEditTask,
  onDeleteTasks,
}) => {
  const tasks = externalTasks || [];
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [externalTasks, searchQuery, assigneeFilter]);

  const filteredTasks = tasks.filter((task) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      task.title?.toLowerCase().includes(q) ||
      task.subtitle?.toLowerCase().includes(q) ||
      task.assignedTo?.name?.toLowerCase().includes(q) ||
      task.teamName?.toLowerCase().includes(q) ||
      String(task.dueDate || "")
        .toLowerCase()
        .includes(q);

    const matchesAssignee =
      assigneeFilter === "All Assignees" ||
      task.assignedTo?.name === assigneeFilter;

    return matchesSearch && matchesAssignee;
  });

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentTasks.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    currentTasks.length > 0 &&
    currentTasks.every((t) => selectedIds.includes(t.id));

  const uniqueAssignees = [
    ...new Set(tasks.map((t) => t.assignedTo?.name).filter(Boolean)),
  ];

  if (loading) {
    return <TaskTableSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-full sm:max-w-[28rem] flex-1 min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LuSearch className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-10 pr-3 text-xs sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* All Assignees — same CustomSelect style as Students "All courses" */}
          <CustomSelect
            label="Assignee"
            defaultOption="All Assignees"
            options={uniqueAssignees}
            value={assigneeFilter}
            onChange={setAssigneeFilter}
          />
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (onDeleteTasks) {
                onDeleteTasks(selectedIds)
                  .then(() => setSelectedIds([]))
                  .catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--color-error)] text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-sm)] cursor-pointer"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[680px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-low)]/80">
              <th className="px-4 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer h-4 w-4"
                />
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Team
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => {
                const isSelected = selectedIds.includes(task.id);
                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-[var(--color-surface-low)] transition-colors ${
                      isSelected ? "bg-[var(--color-surface-low)]/70" : ""
                    }`}
                  >
                    <td className="px-4 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(task.id)}
                        className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer h-4 w-4"
                      />
                    </td>

                    <td className="px-4 py-4 min-w-0">
                      <button
                        type="button"
                        onClick={() => onEditTask?.(task)}
                        className="flex flex-col text-left cursor-pointer group max-w-[220px]"
                      >
                        <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] text-sm transition-colors truncate">
                          {task.title}
                        </span>
                        {task.subtitle ? (
                          <span className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                            {task.subtitle}
                          </span>
                        ) : null}
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${task.assignedTo?.avatarBg || "bg-gray-100 text-gray-700"}`}
                        >
                          {task.assignedTo?.avatarText || "?"}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-[var(--color-text)] truncate max-w-[120px]">
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs sm:text-sm text-[var(--color-text-muted)] whitespace-nowrap">
                      {task.teamName || task.assignedTo?.teamName || "—"}
                    </td>

                    <td className="px-4 py-4 text-xs sm:text-sm text-[var(--color-text-muted)] whitespace-nowrap">
                      {task.dueDate}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEditTask?.(task)}
                          aria-label="Edit task"
                          className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 cursor-pointer transition-colors"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteTasks?.([task.id]).catch(() => {});
                          }}
                          aria-label="Delete task"
                          className="p-1.5 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error)]/10 cursor-pointer transition-colors"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]"
                >
                  No tasks found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)] mt-2">
        <div className="text-xs sm:text-sm text-[var(--color-text-muted)]">
          Showing{" "}
          <span className="font-medium text-[var(--color-text)]">
            {filteredTasks.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[var(--color-text)]">
            {Math.min(startIndex + pageSize, filteredTasks.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[var(--color-text)]">
            {totalItems}
          </span>{" "}
          tasks
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-outline)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Previous page"
          >
            <LuChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-surface-low)] text-[var(--color-text)]">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-outline)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Next page"
          >
            <LuChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
