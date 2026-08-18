const statusStyles = {
  Completed: "text-[#16a34a] bg-[#dcfce7]",
  "In Progress": "text-[#d97706] bg-[#fef3c7]",
  Pending: "text-[var(--color-secondary)] bg-[var(--color-secondary)]/10",
};

function formatDeadline(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Recent Performance — student's assigned tasks only.
 * Task model has no progress field; status is shown as-is from backend.
 */
const StudentRecentPerformance = ({ tasks = [] }) => {
  const list = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="app-panel flex h-full flex-1 flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
          Recent Performance
        </h3>
      </div>

      {list.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm text-[var(--color-text-muted)]">
            No tasks assigned
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--color-surface-highest)]">
                <th className="pb-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="pb-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-1/4">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-1/4 text-right">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
              {list.map((task) => (
                <tr key={task.id || task._id}>
                  <td className="py-4 font-semibold text-[var(--color-text)] max-w-[240px] truncate">
                    {task.title || "—"}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        statusStyles[task.status] ||
                        "text-[var(--color-text-muted)] bg-[var(--color-surface-high)]"
                      }`}
                    >
                      {task.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-[var(--color-text-muted)]">
                    {formatDeadline(task.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentRecentPerformance;
