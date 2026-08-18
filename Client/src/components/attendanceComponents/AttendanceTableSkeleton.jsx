import Skeleton from "../ui/Skeleton";

const HEADERS = [
  "Roll No",
  "Student",
  "Date",
  "Check In",
  "Check Out",
  "Status",
  "Reason",
  "Change",
];

export default function AttendanceTableSkeleton({ rows = 8 }) {
  return (
    <div className="w-full max-sm:overflow-x-auto">
      <table className="w-full table-fixed text-left max-sm:min-w-[780px]">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-surface-highest)]">
            {HEADERS.map((h) => (
              <th
                key={h}
                className={`px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider align-middle ${
                  h === "Change" ? "text-right" : ""
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
              {HEADERS.map((h) => (
                <td
                  key={h}
                  className={`px-3 py-4 align-middle ${h === "Change" ? "text-right" : ""}`}
                >
                  <Skeleton className="h-4 w-16 inline-block" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
