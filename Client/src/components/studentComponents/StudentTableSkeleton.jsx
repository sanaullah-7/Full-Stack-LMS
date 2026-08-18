import Skeleton from "../ui/Skeleton";

const HEADERS = [
  "Roll No",
  "Name",
  "Course",
  "Batch",
  "Team",
  "Attendance",
  "Status",
  "Actions",
];

export default function StudentTableSkeleton({ rows = 8 }) {
  return (
    <div className="relative w-full max-sm:overflow-x-auto">
      <table className="w-full table-fixed text-left max-sm:min-w-[720px]">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
          <col className="w-[11%]" />
          <col className="w-[12%]" />
          <col className="w-[16%]" />
          <col className="w-[11%]" />
          <col className="w-[8%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {HEADERS.map((h) => (
              <th
                key={h}
                className={`px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider ${
                  h === "Actions" ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-surface-highest)]">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-3 py-4">
                <Skeleton className="h-3.5 w-14" />
              </td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-3.5 w-20" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-3.5 w-16" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-1.5 w-full mt-1" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="px-3 py-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
