import { useState, useEffect } from "react";
import { LuX, LuChevronDown } from "react-icons/lu";
import { getLocalToday, toYmd } from "../../utils/localDate";

const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return toYmd(parsed);
  }
  return "";
};

const EditTaskModal = ({
  task,
  onClose,
  onSave,
  mode = "edit",
  dynamicAssignees = [],
}) => {
  const isCreate = mode === "create" || !task;
  const assigneeList = Array.isArray(dynamicAssignees) ? dynamicAssignees : [];

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedToId, setAssignedToId] = useState("");
  const [dueDate, setDueDate] = useState(getLocalToday());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setSubtitle(task.subtitle || "");
      setStatus(task.status || "Pending");
      setAssignedToId(task.assignedTo?.id ? String(task.assignedTo.id) : "");
      setDueDate(toDateInputValue(task.dueDate) || getLocalToday());
    } else {
      setTitle("");
      setSubtitle("");
      setStatus("Pending");
      setAssignedToId("");
      setDueDate(getLocalToday());
    }
    setFormError("");
  }, [task, isCreate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      setFormError("Task title is required");
      return;
    }
    if (!assignedToId) {
      setFormError("Please assign this task to a student");
      return;
    }

    const selectedAssignee = assigneeList.find(
      (a) => String(a.id) === String(assignedToId),
    );
    if (!selectedAssignee) {
      setFormError("Please select a valid student");
      return;
    }

    const taskData = {
      id: task?.id,
      title: title.trim(),
      subtitle: subtitle.trim(),
      status,
      updateStatus: status,
      assignedTo: selectedAssignee,
      dueDate: dueDate || getLocalToday(),
    };

    setIsSubmitting(true);
    setFormError("");
    try {
      await onSave(taskData);
    } catch {
      // Parent shows toast; keep modal open
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] w-[95%] sm:w-[600px] md:w-[650px] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            {isCreate ? "Create New Task" : "Edit Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 pt-5 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Complete Project Proposal"
                  className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                  Description
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Optional details for the student"
                  className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors appearance-none cursor-pointer pr-10 disabled:opacity-60"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <LuChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                  Assign to Student *
                </label>
                <div className="relative">
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    required
                    disabled={isSubmitting || assigneeList.length === 0}
                    className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors appearance-none cursor-pointer pr-10 disabled:opacity-60"
                  >
                    <option value="">
                      {assigneeList.length === 0
                        ? "No students available"
                        : "-- Select student --"}
                    </option>
                    {assigneeList.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <LuChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-60"
                />
              </div>
            </div>

            {formError ? (
              <p className="mt-4 text-sm text-[var(--color-error)]">{formError}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-surface)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-low)] text-[var(--color-text)] text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || assigneeList.length === 0}
              className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? isCreate
                  ? "Creating..."
                  : "Saving..."
                : isCreate
                  ? "Create Task"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
