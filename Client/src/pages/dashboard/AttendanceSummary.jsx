import { useMemo } from "react";
import { Calendar, Search, UserCheck2, X, CheckCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { DashboardAttendanceTableSkeleton } from "../../components/dashboard/DashboardSkeleton";

function StatusBadge({ status }) {
  if (status === "Present") {
    return (
      <span
        title="Present"
        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-success)] border border-[var(--color-success)]/20"
      >
        Present
      </span>
    );
  }
  if (status === "Absent") {
    return (
      <span
        title="Absent"
        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-error)] border border-[var(--color-error)]/20"
      >
        Absent
      </span>
    );
  }
  if (status === "Leave") {
    return (
      <span
        title="Leave"
        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-warning)] border border-[var(--color-warning)]/20"
      >
        Leave
      </span>
    );
  }
  return (
    <span
      title="Not marked"
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)] border border-[var(--color-surface-high)]/80"
    >
      --
    </span>
  );
}

export default function AttendanceSummary({
  attendanceData,
  searchQuery,
  setSearchQuery,
  feedbackMessage,
  isLoading,
  handleMarkStudentPresent,
  handleMarkStudentCheckOut,
  handleShortcutMarkPresent,
}) {
  // Filter & sort students (newest checked-in / updated students ALWAYS placed at the TOP)
  const filteredStudents = useMemo(() => {
    let list = [...attendanceData];
    // Sort by lastUpdated descending so newest items stay at the TOP
    list.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.rollNo.toLowerCase().includes(query) ||
        s.course.toLowerCase().includes(query),
    );
  }, [attendanceData, searchQuery]);

  return (
    <div className="app-panel flex min-w-0 flex-col gap-3 p-4 sm:p-5 lg:col-span-2">
      {/* Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-surface-high)] pb-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="rounded-lg p-1 text-[var(--color-primary)]">
            <Calendar size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Today&apos;s Attendance Summary
            </h2>
          </div>
        </div>

        <NavLink
          to="/attendance"
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline self-start sm:self-auto"
        >
          Manage
        </NavLink>
      </div>

      {/* Search Bar (Integrated directly inside Today's Attendance Summary) */}
      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleShortcutMarkPresent}
          className="flex flex-col sm:flex-row items-center gap-[var(--spacing-md)] w-full"
        >
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or roll nubmber..."
              disabled={isLoading}
              className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] pl-10 pr-[var(--spacing-xl)] py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-all duration-[var(--duration-fast)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)] disabled:opacity-60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-high)] rounded-full px-1 py-0.5"
              >
                <X />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-[var(--color-on-primary)] transition-all duration-[var(--duration-fast)] hover:opacity-90 active:scale-[0.98] shadow-sm whitespace-nowrap disabled:opacity-60"
          >
            <UserCheck2 size={16} strokeWidth={2.2} />
            <span>Mark Present</span>
          </button>
        </form>

        {/* Feedback Notification Alert */}
        {feedbackMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-[var(--color-success)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-success)] border border-[var(--color-success)]/20 animate-fade-in">
            <CheckCircle2 size={14} />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Table / skeleton */}
      {isLoading ? (
        <DashboardAttendanceTableSkeleton />
      ) : (
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
                <th className="px-1 py-2.5">Roll No</th>
                <th className="px-1 py-2.5">Student Name</th>
                <th className="px-1 py-2.5">Course</th>
                <th className="px-1 py-2.5">Check-in</th>
                <th className="px-1 py-2.5">Check-out</th>
                <th className="px-1 py-2.5 text-center">Status</th>
                <th className="px-1 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-high)] bg-[var(--color-surface)]">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-low)]/80"
                  >
                    <td className="px-2 py-2.5 align-middle font-mono text-[12px] font-bold text-[var(--color-text)]  " title={String(student.rollNo)}>
                      <span className="block truncate">{student.rollNo}</span>
                    </td>
                    <td className="px-2 py-2.5 align-middle min-w-0" title={student.name}>
                      <span className="block text-[12px] font-semibold leading-snug text-[var(--color-primary)]  line-clamp-2 break-words">
                        {student.name}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle min-w-0 text-[var(--color-text-muted)]" title={student.course}>
                      <span className="block text-[11px] leading-snug line-clamp-2 break-words">
                        {student.course}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle text-[var(--color-text-muted)]">
                      <span className="block truncate font-mono text-[11px]" title={student.checkIn}>
                        {student.checkIn}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle text-[var(--color-text-muted)]">
                      <span className="block truncate font-mono text-[11px]" title={student.checkOut}>
                        {student.checkOut}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center align-middle">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-2 py-2.5 text-center align-middle">
                      {student.status !== "Present" ? (
                        <button
                          type="button"
                          onClick={() => handleMarkStudentPresent(student.id)}
                          title="Mark Present"
                          aria-label="Mark Present"
                          className="inline-flex min-w-[28px] items-center justify-center rounded-md bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/20 px-2 py-1 text-[11px] font-semibold text-[var(--color-success)] transition-colors"
                        >
                          P
                        </button>
                      ) : student.checkOut === "--" ? (
                        <button
                          type="button"
                          onClick={() => handleMarkStudentCheckOut(student.id)}
                          title="Check Out"
                          aria-label="Check Out"
                          className="inline-flex min-w-[28px] items-center justify-center rounded-md bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 px-2 py-1 text-[11px] font-semibold text-[var(--color-secondary)] transition-colors"
                        >
                          CO
                        </button>
                      ) : (
                        <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-[var(--color-text-muted)]"
                  >
                    <p className="text-sm font-medium">
                      {searchQuery
                        ? `No student records found matching "${searchQuery}"`
                        : "No attendance records found."}
                    </p>
                    {searchQuery && (
                      <p className="text-xs mt-1">
                        Try searching with a different roll number, name, or
                        course.
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}