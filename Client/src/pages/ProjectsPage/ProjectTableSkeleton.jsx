import Skeleton from "../../components/ui/Skeleton";

const HEADERS = ["Project", "Team", "Status", "Deadline", "Actions"];

export default function ProjectTableSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full table-fixed text-left min-w-[720px]">
        <colgroup>
          <col className="w-[32%]" />
          <col className="w-[18%]" />
          <col className="w-[18%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            {HEADERS.map((item) => (
              <th
                key={item}
                className={`px-3 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider align-middle ${
                  item === "Actions" ? "text-right" : ""
                }`}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...Array(6)].map((_, index) => (
            <tr key={index} className="border-b border-border">
              <td className="px-3 py-4 align-middle">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24 mt-2" />
              </td>
              <td className="px-3 py-4 align-middle">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="px-3 py-4 align-middle">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-3 py-4 align-middle">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-3 py-4 align-middle text-right">
                <div className="inline-flex justify-end gap-3">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-5 h-5 rounded-full" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
