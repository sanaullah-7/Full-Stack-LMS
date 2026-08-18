import { useState, useMemo, useEffect, useRef } from "react";
import {
  GraduationCap,
  UserCheck,
  UserX,
  Users,
  ClipboardList,
  Calendar,
  ClipboardCheck,
  Search,
  CheckCircle2,
  UserCheck2,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  getTaskData,
  getDashboardStats,
} from "../../api/axios";
import {
  getAttendanceByDate,
  markAttendance,
} from "../../Services/attendance.services.js";
import {
  DashboardStatCardsSkeleton,
  DashboardAttendanceTableSkeleton,
  DashboardTasksSkeleton,
} from "../../components/dashboard/DashboardSkeleton";
import { getLocalToday } from "../../utils/localDate";

const taskStatusStyles = {
  Completed:
    " text-[var(--color-success)] border border-[var(--color-success)]/20",
  "In Progress":
    "text-[var(--color-warning)] border border-[var(--color-warning)]/20",
  Pending:
    "text-[var(--color-secondary)] border border-[var(--color-secondary)]/20",
};

// Helper for formatted time (e.g., 09:37 AM)
const getCurrentTimeString = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

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

function TaskRow({ title, student, rollNumber, teamName, dueDate, status }) {
  const teamLabel = teamName || "Unassigned";

  return (
    <div className="rounded-[var(--radius-lg)] border border-transparent px-2.5 py-3 transition-all duration-[var(--duration-fast)] last:border-b-0 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-low)] hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p
          className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-[var(--color-text)] break-words"
          title={title}
        >
          {title}
        </p>
        <span
          className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-none ${taskStatusStyles[status] || taskStatusStyles.Pending}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-[11px] leading-snug text-[var(--color-text-muted)]">
        <p className="truncate font-semibold text-[var(--color-text)]" title={student}>
          {student}
        </p>
        <p className="truncate" title={`Roll ${rollNumber}`}>
          Roll {rollNumber}
        </p>
        <p
          className="truncate font-semibold text-[var(--color-primary)]"
          title={`Team: ${teamLabel}`}
        >
          Team: {teamLabel}
        </p>
        <p className="truncate" title={`Due ${dueDate}`}>
          Due {dueDate}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [task, setTask] = useState([]);
  const [stats, setStats] = useState({});
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const trackedTodayRef = useRef(getLocalToday());

  // Refetch whenever Dashboard becomes active so deleted/updated attendance is fresh.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        // Browser LOCAL calendar day — never UTC toISOString (causes wrong-day Present)
        const today = getLocalToday();
        trackedTodayRef.current = today;
        const [statsResponse, attendanceResponse, taskResponse] = await Promise.all([
          getDashboardStats(today),
          getAttendanceByDate(today),
          getTaskData(),
        ]);

        setStats(statsResponse?.data ?? {});

        // Only keep records with a valid populated student — never show "Unknown student"
        const validRecords = (attendanceResponse?.attendance ?? []).filter(
          (record) => record?.student_id && record.student_id.name,
        );

        setAttendanceData(
          validRecords.map((record) => ({
            id: record._id,
            studentId: record.student_id._id,
            rollNo: record.student_id.rollNumber,
            name: record.student_id.name,
            course: record.student_id.course ?? "--",
            checkIn: record.checkInTime || "--",
            checkOut: record.checkOutTime || "--",
            status: record.status ?? "Not marked",
            lastUpdated: new Date(record.updatedAt).getTime(),
          })),
        );

        // Skip tasks whose student was deleted (prevents "Unknown student")
        const validTasks = (taskResponse?.data ?? []).filter(
          (item) => item?.studentId && item.studentId.name,
        );
        setTask(validTasks);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoadError(
          error.response?.data?.message ||
            "Dashboard data could not be loaded. Please sign in again and retry.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const syncLocalDay = () => {
      const today = getLocalToday();
      if (today !== trackedTodayRef.current) {
        fetchDashboardData();
      }
    };
    const intervalId = setInterval(syncLocalDay, 30000);
    window.addEventListener("focus", syncLocalDay);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", syncLocalDay);
    };
  }, [location.pathname, location.key]);

  // Dynamically calculated stats from API response
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

  // Persist Present to backend so Attendance page + refresh keep the same status
  const handleMarkStudentPresent = async (rowId) => {
    const student = attendanceData.find((s) => s.id === rowId);
    if (!student) return;

    if (student.status === "Present") {
      setFeedbackMessage(
        "This student is already marked Present and cannot be marked again.",
      );
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    if (!student.studentId) {
      setFeedbackMessage("Student record is missing. Cannot mark present.");
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    const timeNowStr = getCurrentTimeString();
    const checkInTime =
      student.checkIn === "--" ? timeNowStr : student.checkIn;
    const previous = { ...student };

    setAttendanceData((prevData) =>
      prevData.map((s) =>
        s.id === rowId
          ? {
              ...s,
              status: "Present",
              checkIn: checkInTime,
              lastUpdated: Date.now(),
            }
          : s,
      ),
    );
    setFeedbackMessage(
      `Marked "${student.name}" (${student.rollNo}) as Present at ${timeNowStr}!`,
    );
    setTimeout(() => setFeedbackMessage(""), 3500);

    try {
      const today = getLocalToday();
      await markAttendance({
        date: today,
        students: [
          {
            student_id: student.studentId,
            status: "Present",
            checkInTime,
            checkOutTime: student.checkOut === "--" ? "" : student.checkOut,
            note: "",
          },
        ],
      });

      const statsResponse = await getDashboardStats(today);
      setStats(statsResponse?.data ?? {});
    } catch (error) {
      console.error("Failed to mark present:", error);
      setAttendanceData((prevData) =>
        prevData.map((s) => (s.id === rowId ? previous : s)),
      );
      setFeedbackMessage(
        error.response?.data?.message ||
          "Failed to save Present status. Please try again.",
      );
      setTimeout(() => setFeedbackMessage(""), 4000);
    }
  };

  // Persist Check Out to backend so it survives refresh
  const handleMarkStudentCheckOut = async (rowId) => {
    const student = attendanceData.find((s) => s.id === rowId);
    if (!student) return;

    if (student.checkOut !== "--") {
      setFeedbackMessage("This student has already been checked out.");
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    if (!student.studentId) {
      setFeedbackMessage("Student record is missing. Cannot check out.");
      setTimeout(() => setFeedbackMessage(""), 3000);
      return;
    }

    const timeNowStr = getCurrentTimeString();
    const previous = { ...student };

    setAttendanceData((prevData) =>
      prevData.map((s) =>
        s.id === rowId
          ? {
              ...s,
              checkOut: timeNowStr,
              lastUpdated: Date.now(),
            }
          : s,
      ),
    );
    setFeedbackMessage(
      `Checked out "${student.name}" (${student.rollNo}) at ${timeNowStr}!`,
    );
    setTimeout(() => setFeedbackMessage(""), 3500);

    try {
      const today = getLocalToday();
      await markAttendance({
        date: today,
        students: [
          {
            student_id: student.studentId,
            status: student.status || "Present",
            checkInTime: student.checkIn === "--" ? "" : student.checkIn,
            checkOutTime: timeNowStr,
            note: "",
          },
        ],
      });

      const statsResponse = await getDashboardStats(today);
      setStats(statsResponse?.data ?? {});
    } catch (error) {
      console.error("Failed to check out:", error);
      setAttendanceData((prevData) =>
        prevData.map((s) => (s.id === rowId ? previous : s)),
      );
      setFeedbackMessage(
        error.response?.data?.message ||
          "Failed to save Check Out. Please try again.",
      );
      setTimeout(() => setFeedbackMessage(""), 4000);
    }
  };

  // Shortcut for Search Bar: Mark the first non-present matching student as Present
  const handleShortcutMarkPresent = (e) => {
    if (e) e.preventDefault();
    const studentToMark = filteredStudents.find(
      (student) => student.status !== "Present",
    );
    if (studentToMark) {
      handleMarkStudentPresent(studentToMark.id);
    } else {
      setFeedbackMessage(
        "No student selected to mark Present. All visible students are already Present.",
      );
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-3 sm:gap-5 sm:p-5 lg:p-6">
      {/* Stat cards */}
      {isLoading ? (
        <DashboardStatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {loadError && (
        <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {loadError}
        </p>
      )}

      {/* Main Grid Section: Today's Attendance Table + Task Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {/* Today's Attendance Student List Card (Spans 2 columns on lg) */}
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

        {/* Task summary — grows with tasks up to max height, then vertical scroll only */}
        <div className="app-panel flex max-h-[28rem] w-full min-w-0 flex-col overflow-hidden p-4 sm:p-5 lg:col-span-1 lg:self-start">
          <div className="mb-2 flex shrink-0 items-start justify-between gap-2 border-b border-[var(--color-surface-high)] pb-2">
            <div className="flex min-w-0 items-center gap-[var(--spacing-sm)]">
              <div className="shrink-0 rounded-lg p-1 text-[var(--color-primary)]">
                <ClipboardCheck size={20} strokeWidth={2} />
              </div>
              <h2 className="text-sm font-bold leading-snug text-[var(--color-text)] sm:text-base">
                Today&apos;s Task Summary
              </h2>
            </div>
            <NavLink
              to="/tasks"
              className="shrink-0 text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Manage
            </NavLink>
          </div>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <DashboardTasksSkeleton />
            ) : task.length ? (
              task.map((item) => (
                <TaskRow
                  key={item._id}
                  title={item.title}
                  student={item.studentId.name}
                  rollNumber={item.studentId.rollNumber ?? "--"}
                  teamName={item.studentId.team_id?.name || null}
                  dueDate={item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "--"}
                  status={item.status?.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Pending"}
                />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                No tasks found for today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
