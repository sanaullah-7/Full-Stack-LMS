import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getTaskData,
  getDashboardStats,
} from "../../api/axios";
import {
  getAttendanceByDate,
  markAttendance,
} from "../../Services/attendance.services.js";
import { getLocalToday } from "../../utils/localDate";

import Cards from "./Cards";
import AttendanceSummary from "./AttendanceSummary";
import TaskSummary from "./TaskSummary";

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
    const studentToMark = attendanceData
      .filter((student) => {
        const query = searchQuery.toLowerCase().trim();
        return (
          student.name.toLowerCase().includes(query) ||
          student.rollNo.toLowerCase().includes(query) ||
          student.course.toLowerCase().includes(query)
        );
      })
      .find((student) => student.status !== "Present");

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
      <Cards stats={stats} isLoading={isLoading} />

      {loadError && (
        <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {loadError}
        </p>
      )}

      {/* Main Grid Section: Today's Attendance Table + Task Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {/* Today's Attendance Student List Card (Spans 2 columns on lg) */}
        <AttendanceSummary
          attendanceData={attendanceData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          feedbackMessage={feedbackMessage}
          isLoading={isLoading}
          handleMarkStudentPresent={handleMarkStudentPresent}
          handleMarkStudentCheckOut={handleMarkStudentCheckOut}
          handleShortcutMarkPresent={handleShortcutMarkPresent}
        />

        {/* Task summary */}
        <TaskSummary task={task} isLoading={isLoading} />
      </div>
    </div>
  );
}