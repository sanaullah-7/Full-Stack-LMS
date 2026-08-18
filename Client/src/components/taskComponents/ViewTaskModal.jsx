import {
  LuX,
  LuFileText,
  LuCalendar,
  LuUser,
  LuFlag,
  LuCircleCheck,
} from "react-icons/lu";

const PriorityBadge = ({ priority }) => {
  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
  if (priority === "High") {
    badgeStyle = "bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]/40";
  } else if (priority === "Medium") {
    badgeStyle = "bg-[#fef3c7] text-[#d97706] border-[#fcd34d]/40";
  } else if (priority === "Low") {
    badgeStyle = "bg-[#dcfce7] text-[#16a34a] border-[#86efac]/40";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      {priority}
    </span>
  );
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "No date";
  if (dateStr === "Tomorrow" || dateStr === "Yesterday") return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateStr;
};

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";
  if (status === "In Progress") {
    badgeStyle = "bg-[#f3e8ff] text-[#9333ea] border-[#d8b4fe]/40";
  } else if (status === "Pending" || status === "To Do") {
    badgeStyle = "bg-[#e0e7ff] text-[#4f46e5] border-[#a5b4fc]/40";
  } else if (status === "Completed" || status === "Done") {
    badgeStyle = "bg-[#d1fae5] text-[#059669] border-[#6ee7b7]/40";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      {status}
    </span>
  );
};

const ViewTaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] w-[95%] sm:w-[500px] md:w-[540px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--color-surface-low)] text-[var(--color-primary)]">
              <LuFileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                Task Details
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                ID: #{task.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)] rounded-lg transition-colors cursor-pointer"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Title & Description */}
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)] leading-snug">
              {task.title}
            </h3>
            {task.subtitle && (
              <p className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed bg-[var(--color-surface-low)] p-3 rounded-lg border border-[var(--color-border)]/50">
                {task.subtitle}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Priority */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <LuFlag className="h-3.5 w-3.5" /> Priority
              </span>
              <div>
                <PriorityBadge priority={task.priority} />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <LuCircleCheck className="h-3.5 w-3.5" /> Status
              </span>
              <div>
                <StatusBadge status={task.status} />
              </div>
            </div>

            {/* Assigned To */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <LuUser className="h-3.5 w-3.5" /> Assigned To
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${task.assignedTo?.avatarBg}`}
                >
                  {task.assignedTo?.avatarText}
                </div>
                <span className="text-xs font-medium text-[var(--color-text)]">
                  {task.assignedTo?.name}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <LuCalendar className="h-3.5 w-3.5" /> Due Date
              </span>
              <span className="text-xs font-medium text-[var(--color-text)] mt-0.5">
                {formatDisplayDate(task.dueDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-low)]/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
