import React from "react";
import { StatCard } from "../common/StatCard";
import { CheckCircle2, XCircle, Clock, Percent } from "lucide-react";

export const AttendanceStatsCard = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Attendance Rate"
        value={summary?.percentage || "0%"}
        subtitle="Minimum requirement: 75%"
        icon={Percent}
      />
      <StatCard
        title="Total Present"
        value={summary?.presentCount || 0}
        subtitle="Classes attended"
        icon={CheckCircle2}
      />
      <StatCard
        title="Total Absent"
        value={summary?.absentCount || 0}
        subtitle="Unexcused missed classes"
        icon={XCircle}
      />
      <StatCard
        title="Approved Leaves"
        value={summary?.leaveCount || 0}
        subtitle="Sanctioned leaves"
        icon={Clock}
      />
    </div>
  );
};
