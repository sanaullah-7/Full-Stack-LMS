import Attendance from "../models/attendence.Model.js";
import Student from "../models/student.Model.js";
import {
  assertYmd,
  getAttendanceDayRange,
  toAttendanceDate,
} from "../utils/attendanceDate.js";
import { syncDerivedNotifications } from "./notification.Service.js";

// MARK / UPDATE ATTENDANCE (upsert for student_id + that calendar day only)
export const markAttendance = async (students, date) => {
  const ymd = assertYmd(date);
  const dayDate = toAttendanceDate(ymd);
  const { start, end } = getAttendanceDayRange(ymd);
  const attendanceRecords = [];

  for (const student of students) {
    const existingStudent = await Student.findById(student.student_id);

    if (!existingStudent) {
      throw new Error(`Student not Found ${student.student_id}`);
    }

    // Prefer exact day key; also match any legacy same-day timestamps
    let attendance = await Attendance.findOneAndUpdate(
      {
        student_id: student.student_id,
        date: { $gte: start, $lt: end },
      },
      {
        student_id: student.student_id,
        date: dayDate,
        status: student.status || "Not marked",
        checkInTime: student.checkInTime || "",
        checkOutTime: student.checkOutTime || "",
        note: student.note || "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!attendance) {
      attendance = await Attendance.create({
        student_id: student.student_id,
        date: dayDate,
        status: student.status || "Not marked",
        checkInTime: student.checkInTime || "",
        checkOutTime: student.checkOutTime || "",
        note: student.note || "",
      });
    }

    attendanceRecords.push(attendance);
  }

  // Refresh attendance/low-attendance derived notifications from live data
  await syncDerivedNotifications({ force: true });

  return attendanceRecords;
};

// GET ATTENDANCE BY DATE — only that calendar day
export const getAttencdanceByDate = async (date) => {
  const { start, end } = getAttendanceDayRange(date);

  const attendance = await Attendance.find({
    date: { $gte: start, $lt: end },
  })
    .populate({
      path: "student_id",
      select: "rollNumber name course batch team_id",
      populate: { path: "team_id", select: "name" },
    })
    .sort({ updatedAt: -1 });

  // Skip orphans + dedupe: one row per student (latest update wins)
  const byStudent = new Map();
  for (const record of attendance) {
    if (!record.student_id) continue;
    const sid = String(record.student_id._id || record.student_id);
    if (!byStudent.has(sid)) {
      byStudent.set(sid, record);
    }
  }
  return Array.from(byStudent.values());
};

// Get Students Attendace History
export const getStudentAttendacehistory = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const attendance = await Attendance.find({ student_id: studentId }).sort({
    date: -1,
  });
  return attendance;
};

// get overall attendance status + Active/Inactive (threshold: >= 75% Active)
export const getOverAllAttendanceStatus = async () => {
  const students = await Student.find();
  const stats = [];
  const ACTIVE_THRESHOLD = 75;

  for (const student of students) {
    const attendance = await Attendance.find({ student_id: student._id });

    const workingDays = attendance.filter((record) => {
      const day = new Date(record.date).getUTCDay();
      return day !== 0;
    });
    const totalDays = workingDays.length;

    const presentDays = workingDays.filter(
      (record) => record.status === "Present",
    ).length;
    const absentDays = workingDays.filter(
      (record) => record.status === "Absent",
    ).length;
    const leaveDays = workingDays.filter(
      (record) => record.status === "Leave",
    ).length;

    const percentageRaw = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const percentage = Math.round(percentageRaw);
    // Option A: >= 75 Active, otherwise Inactive (includes 0% / no records)
    const status = percentageRaw >= ACTIVE_THRESHOLD ? "Active" : "Inactive";

    stats.push({
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        course: student.course,
        batch: student.batch,
      },
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      percentage,
      status,
    });
  }
  return stats;
};
