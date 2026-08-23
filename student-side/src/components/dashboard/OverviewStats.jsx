import React from "react";
import { StatCard } from "../common/StatCard";
import { CalendarCheck, CheckSquare, Users, Trophy } from "lucide-react";

export const OverviewStats = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Attendance Rate"
        value={data?.attendance?.percentage || "0%"}
        subtitle={`${data?.attendance?.presentCount || 0} / ${data?.attendance?.totalClasses || 0} Classes`}
        icon={CalendarCheck}
      />
      <StatCard
        title="Tasks Completed"
        value={`${data?.tasks?.completed || 0} / ${data?.tasks?.total || 0}`}
        subtitle={`${data?.tasks?.pending || 0} Tasks Pending`}
        icon={CheckSquare}
      />
      <StatCard
        title="Team Status"
        value={data?.team?.teamName || "Assigned"}
        subtitle={`${data?.team?.members?.length || 0} Teammates`}
        icon={Users}
      />
      <StatCard
        title="Performance"
        value="Good Standing"
        subtitle="Eligible for Certification"
        icon={Trophy}
      />
    </div>
  );
};
