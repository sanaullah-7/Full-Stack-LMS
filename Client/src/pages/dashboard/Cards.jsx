import { GraduationCap, UserCheck, UserX, Users, ClipboardList } from "lucide-react";
import { DashboardStatCardsSkeleton } from "../../components/dashboard/DashboardSkeleton";

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="group flex items-start justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)] sm:p-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] sm:text-sm sm:normal-case sm:tracking-normal sm:font-medium">
          {label}
        </p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight text-[var(--color-text)]">
          {value}
        </p>
      </div>
      <div className={`app-stat-icon shrink-0 ${tone}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
  );
}

export default function Cards({ stats, isLoading }) {
  const totalStudents = stats.totalStudents || 0;
  const totalTeams = stats.totalTeams || 0;
  const totalPendingTasks = stats.pendingTasks || 0;
  const presentCount = stats.attendanceToday?.present ?? 0;
  const absentCount = stats.attendanceToday?.absent ?? 0;

  const statCards = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      tone: "text-[var(--color-primary)]",
    },
    {
      label: "Present Today",
      value: presentCount,
      icon: UserCheck,
      tone: "text-[var(--color-success)]",
    },
    {
      label: "Absent Today",
      value: absentCount,
      icon: UserX,
      tone: "text-[var(--color-error)]",
    },
    {
      label: "Total Teams",
      value: totalTeams,
      icon: Users,
      tone: "text-[var(--color-primary)]",
    },
    {
      label: "Pending Tasks",
      value: totalPendingTasks,
      icon: ClipboardList,
      tone: "text-[var(--color-secondary)]",
    },
  ];

  if (isLoading) {
    return <DashboardStatCardsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}