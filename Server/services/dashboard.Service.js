import Student from "../models/student.Model.js";
import { Team } from "../models/team.Model.js";
import { Task } from "../models/taskModel.js";
import Attendance from "../models/attendence.Model.js";
import {
  assertYmd,
  getAttendanceDayRange,
} from "../utils/attendanceDate.js";

/**
 * Dashboard "today" stats for a calendar day (YYYY-MM-DD).
 * Client should pass the browser local date. If omitted, falls back to
 * server local calendar day (not UTC toISOString).
 */
function fallbackLocalYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const getDashboardStatsService = async (dateStr) => {
  const ymd = dateStr ? assertYmd(dateStr) : fallbackLocalYmd();
  const { start, end } = getAttendanceDayRange(ymd);

  const [totalStudents, totalTeams, pendingTasks, attendanceRecords] =
    await Promise.all([
      Student.countDocuments(),
      Team.countDocuments(),
      Task.countDocuments({ status: { $in: ["pending", "Pending"] } }),
      Attendance.find({ date: { $gte: start, $lt: end } }),
    ]);

  // One status per student (latest record wins) — prevents Present > Total Students
  const latestByStudent = new Map();
  for (const record of attendanceRecords) {
    const sid = String(record.student_id);
    const prev = latestByStudent.get(sid);
    if (
      !prev ||
      new Date(record.updatedAt || 0) > new Date(prev.updatedAt || 0)
    ) {
      latestByStudent.set(sid, record);
    }
  }
  const uniqueRecords = Array.from(latestByStudent.values());

  const presentToday = uniqueRecords.filter(
    (r) => r.status === "Present",
  ).length;
  const absentToday = uniqueRecords.filter(
    (r) => r.status === "Absent",
  ).length;
  const leaveToday = uniqueRecords.filter((r) => r.status === "Leave").length;
  const notMarkedToday = uniqueRecords.filter(
    (r) => r.status === "Not marked",
  ).length;

  return {
    totalStudents,
    totalTeams,
    pendingTasks,
    attendanceToday: {
      date: ymd,
      totalRecords: uniqueRecords.length,
      present: presentToday,
      absent: absentToday,
      leave: leaveToday,
      notMarked: notMarkedToday,
    },
  };
};
