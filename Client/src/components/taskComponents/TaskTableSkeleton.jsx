import Skeleton from "../ui/Skeleton";

export default function TaskTableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-x-auto" aria-busy="true" aria-label="Loading tasks">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-low)]/50">
            {["", "Task Name", "Status", "Assigned To", "Team", "Due Date", ""].map(
              (h, i) => (
                <th key={i} className="px-4 py-3.5">
                  {h ? (
                    <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                      {h}
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-4" />
                  )}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-surface-highest)]">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-4" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-28" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-4">
                <Skeleton className="h-4 w-12 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
