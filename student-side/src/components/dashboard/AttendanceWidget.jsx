import React from "react";
import { Card } from "../common/Card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const AttendanceWidget = ({ attendance }) => {
  const percentage = attendance?.percentage ? parseFloat(attendance.percentage) : 0;

  return (
    <Card
      title="Attendance Overview"
      subtitle="Class attendance progress"
      action={
        <Link
          to="/attendance"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        {/* Simple visual progress circle placeholder */}
        <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-8 border-[var(--color-surface-container)] border-t-[var(--color-primary)]">
          <div className="text-center">
            <span className="text-xl font-bold text-[var(--color-text)]">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-2 w-full text-center">
          <div className="p-3 bg-[var(--color-success-bg)] rounded-xl border border-[var(--color-success-border)]">
            <p className="text-xs text-[var(--color-on-success)] font-medium">Present</p>
            <p className="text-lg font-bold text-[var(--color-on-success)]">
              {attendance?.presentCount || 0}
            </p>
          </div>
          <div className="p-3 bg-[var(--color-error-bg)] rounded-xl border border-[var(--color-error-border)]">
            <p className="text-xs text-[var(--color-on-error)] font-medium">Absent</p>
            <p className="text-lg font-bold text-[var(--color-on-error)]">
              {attendance?.absentCount || 0}
            </p>
          </div>
          <div className="p-3 bg-[var(--color-warning-bg)] rounded-xl border border-[var(--color-warning-border)]">
            <p className="text-xs text-[var(--color-on-warning)] font-medium">Leave</p>
            <p className="text-lg font-bold text-[var(--color-on-warning)]">
              {attendance?.leaveCount || 0}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
