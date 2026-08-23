import Skeleton from "../ui/Skeleton";

const clampPct = (value) => Math.min(Math.max(Number(value) || 0, 0), 100);

const generateAvatarProps = (name) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";
  const colors = [
    { bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" },
    { bg: "bg-[#dcfce7]", text: "text-[#16a34a]" },
    { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
    { bg: "bg-[#fee2e2]", text: "text-[#ef4444]" },
    { bg: "bg-[#f3e8ff]", text: "text-[#9333ea]" },
  ];
  const charCode = initials.charCodeAt(0) || 0;
  return { initials, ...colors[charCode % colors.length] };
};

const StudentProfileInfoCard = ({ profile }) => {
  if (!profile?.student) return null;

  const student = profile.student;
  const { initials, bg, text } = generateAvatarProps(student.name);
  const isActive = profile.status === "Active";
  const tasksPct = clampPct(profile.academicProgress?.tasksCompletedPercent);
  const attendancePct = clampPct(profile.academicProgress?.attendancePercent);
  const teamName = student.team_id?.name || "Not Assigned";
  const enrollmentDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const attendance = profile.attendance || {};

  return (
    <div className="app-panel mb-6 flex flex-col gap-8 p-6 lg:flex-row lg:gap-12 lg:p-8">
      <div className="flex-[1.5] flex flex-col sm:flex-row gap-6">
        <div
          className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-3xl font-bold shadow-sm ${bg} ${text}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight truncate">
              {student.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                isActive
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-[#16a34a]" : "bg-[var(--color-error)]"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Course
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold">
                {student.course || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Batch
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold">
                {student.batch || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Roll Number
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold">
                {student.rollNumber || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Email
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold break-all">
                {student.email || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Phone
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold">
                {student.phone ? student.phone : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
                Enrollment Date
              </p>
              <p className="text-sm text-[var(--color-text)] font-semibold">
                {enrollmentDate}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-[var(--color-surface-low)] px-3 py-2">
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">
                Present
              </p>
              <p className="text-sm font-bold text-[var(--color-text)]">
                {attendance.present ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-low)] px-3 py-2">
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">
                Absent
              </p>
              <p className="text-sm font-bold text-[var(--color-text)]">
                {attendance.absent ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-low)] px-3 py-2">
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">
                Leave
              </p>
              <p className="text-sm font-bold text-[var(--color-text)]">
                {attendance.leave ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--color-surface-low)] px-3 py-2">
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">
                Tasks
              </p>
              <p className="text-sm font-bold text-[var(--color-text)]">
                {profile.tasks?.completed ?? 0}/{profile.tasks?.total ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px bg-[var(--color-surface-highest)]" />
      <div className="lg:hidden h-px w-full bg-[var(--color-surface-highest)]" />

      <div className="flex-1">
        <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight mb-6">
          Academic Progress
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[var(--color-text-muted)]">Tasks Completed</span>
              <span className="text-[#2563eb]">{tasksPct}%</span>
            </div>
            <div className="w-full bg-[var(--color-surface-high)] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563eb] h-2 rounded-full"
                style={{ width: `${tasksPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[var(--color-text-muted)]">Attendance Rate</span>
              <span className="text-[#16a34a]">{attendancePct}%</span>
            </div>
            <div className="w-full bg-[var(--color-surface-high)] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#16a34a] h-2 rounded-full"
                style={{ width: `${attendancePct}%` }}
              />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-1">
              Assigned Team
            </p>
            <p className="text-sm text-[var(--color-text)] font-semibold">
              {teamName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function StudentProfileInfoCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 lg:p-8 mb-6">
      <div className="flex gap-6">
        <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}

export default StudentProfileInfoCard;
