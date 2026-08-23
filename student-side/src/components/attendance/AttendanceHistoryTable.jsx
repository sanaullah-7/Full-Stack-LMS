import React from "react";
import { Badge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";
import { formatDate } from "../../utils/formatters";
import { BADGE_VARIANTS } from "../../constants/statusTypes";
import { Calendar } from "lucide-react";

export const AttendanceHistoryTable = ({ records = [] }) => {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Attendance Logs Found"
        description="No class attendance records match your filter criteria."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-left text-sm text-[var(--color-text)]">
        <thead className="bg-[var(--color-surface-container)] text-xs uppercase font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
          <tr>
            <th className="px-5 py-3.5">#</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5">Topic / Session</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          {records.map((record, index) => (
            <tr
              key={record._id || index}
              className="hover:bg-[var(--color-surface-low)] transition-colors"
            >
              <td className="px-5 py-3.5 text-xs text-[var(--color-text-muted)] font-mono">
                {index + 1}
              </td>
              <td className="px-5 py-3.5 font-medium">
                {formatDate(record.date || record.createdAt)}
              </td>
              <td className="px-5 py-3.5 text-[var(--color-text-muted)]">
                {record.topic || "Class Session"}
              </td>
              <td className="px-5 py-3.5">
                <Badge
                  variant={BADGE_VARIANTS[record.status] || "secondary"}
                  size="sm"
                >
                  {record.status}
                </Badge>
              </td>
              <td className="px-5 py-3.5 text-xs text-[var(--color-text-muted)]">
                {record.remarks || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
