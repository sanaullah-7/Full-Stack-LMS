import Skeleton from "../ui/Skeleton";

export function DashboardStatCardsSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between rounded-[var(--radius-xl)] border border-[var(--color-surface-high)] bg-[var(--color-surface)] p-[var(--spacing-lg)] shadow-[var(--shadow-sm)]"
        >
          <div className="w-full">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-2 h-7 w-12" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DashboardAttendanceTableSkeleton({ rows = 6 }) {
  return (
    <div className="mt-1 min-w-0 rounded-[var(--radius-lg)] border border-[var(--color-surface-high)] max-sm:overflow-x-auto">
      <table className="w-full table-fixed text-left text-xs border-collapse max-sm:min-w-[640px]">
        <colgroup>
          <col className="w-[12%]" />
          <col className="w-[22%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-[var(--color-surface-low)] text-[10px] uppercase font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-surface-high)]">
            <th className="px-2 py-2.5">Roll No</th>
            <th className="px-2 py-2.5">Student Name</th>
            <th className="px-2 py-2.5">Course</th>
            <th className="px-2 py-2.5">Check-in</th>
            <th className="px-2 py-2.5">Check-out</th>
            <th className="px-2 py-2.5 text-center">Status</th>
            <th className="px-2 py-2.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-surface-high)]">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-2 py-2.5">
                <Skeleton className="h-3 w-12" />
              </td>
              <td className="px-2 py-2.5">
                <Skeleton className="h-3 w-24" />
              </td>
              <td className="px-2 py-2.5">
                <Skeleton className="h-3 w-16" />
              </td>
              <td className="px-2 py-2.5">
                <Skeleton className="h-3 w-12" />
              </td>
              <td className="px-2 py-2.5">
                <Skeleton className="h-3 w-12" />
              </td>
              <td className="px-2 py-2.5">
                <div className="flex justify-center">
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </td>
              <td className="px-2 py-2.5">
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardTasksSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-md)] border-b border-[var(--color-surface-high)] px-1 py-2.5 last:border-b-0"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-3.5 w-3/5 max-w-[180px]" />
            <Skeleton className="h-4 w-16 rounded-full shrink-0" />
          </div>
          <Skeleton className="mt-2 h-3 w-28" />
          <Skeleton className="mt-1 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
