import Notification from "../models/notification.Model.js";
import Student from "../models/student.Model.js";
import Attendance from "../models/attendence.Model.js";
import { Team } from "../models/team.Model.js";
import Project from "../models/project.Model.js";
import { Task } from "../models/taskModel.js";
import {
  assertYmd,
  getAttendanceDayRange,
  isSundayYmd,
} from "../utils/attendanceDate.js";

const ACTIVE_ATTENDANCE_THRESHOLD = 75;
const DERIVED_SYNC_TTL_MS = 30_000;
let lastDerivedSyncAt = 0;

const ROUTE_BY_TYPE = {
  STUDENT: "/students",
  ATTENDANCE: "/attendance",
  TEAM: "/teams",
  PROJECT: "/projects",
  TASK: "/tasks",
};

/** Local calendar YYYY-MM-DD (matches how admins mark attendance). */
export function localTodayYmd() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toYmd(value) {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function addDaysYmd(ymd, days) {
  const d = new Date(`${assertYmd(ymd)}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function isCompletedStatus(status) {
  return String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") === "completed";
}

/**
 * Create a one-shot event notification, or upsert by uniqueKey (derived/condition).
 * Never throws to callers — logs and returns null on failure.
 */
export async function createNotification({
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
  uniqueKey = null,
}) {
  try {
    if (!type || !title || !message) return null;

    if (uniqueKey) {
      const existing = await Notification.findOne({ uniqueKey });
      if (existing) {
        const contentChanged =
          existing.message !== message || existing.title !== title;
        existing.type = type;
        existing.title = title;
        existing.message = message;
        existing.relatedId = relatedId;
        existing.relatedType = relatedType;
        // Re-alert only when the live condition/content changed (e.g. new absents)
        if (contentChanged) {
          existing.read = false;
        }
        await existing.save();
        return existing;
      }

      return await Notification.create({
        type,
        title,
        message,
        relatedId,
        relatedType,
        uniqueKey,
        read: false,
      });
    }

    return await Notification.create({
      type,
      title,
      message,
      relatedId,
      relatedType,
      read: false,
    });
  } catch (error) {
    // Duplicate uniqueKey race — treat as success by fetching existing
    if (error?.code === 11000 && uniqueKey) {
      return Notification.findOne({ uniqueKey });
    }
    console.error("createNotification failed:", error.message);
    return null;
  }
}

export async function removeNotificationByUniqueKey(uniqueKey) {
  if (!uniqueKey) return;
  try {
    await Notification.deleteOne({ uniqueKey });
  } catch (error) {
    console.error("removeNotificationByUniqueKey failed:", error.message);
  }
}

export async function getNotifications({ limit = 50 } = {}) {
  await syncDerivedNotifications({ force: true });

  const notifications = await Notification.find({ read: false })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 100))
    .lean();

  const unreadCount = await Notification.countDocuments({ read: false });

  return {
    count: notifications.length,
    unreadCount,
    data: notifications.map((n) => ({
      ...n,
      href: resolveHref(n),
    })),
  };
}

export async function getUnreadCount() {
  await syncDerivedNotifications({ force: false });
  const unreadCount = await Notification.countDocuments({ read: false });
  return { unreadCount };
}

function resolveHref(notification) {
  if (notification.type === "STUDENT" && notification.relatedId) {
    return `/students/${notification.relatedId}`;
  }
  return ROUTE_BY_TYPE[notification.type] || "/dashboard";
}

export async function markNotificationRead(id) {
  const doc = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true },
  );
  if (!doc) {
    throw new Error("Notification not found");
  }
  return doc;
}

export async function markAllNotificationsRead() {
  const result = await Notification.updateMany(
    { read: false },
    { $set: { read: true } },
  );
  return { modifiedCount: result.modifiedCount ?? 0 };
}

/**
 * Derived / condition-based notifications from live DB state.
 * Upserts by uniqueKey so refresh does not spam duplicates.
 */
export async function syncDerivedNotifications({ force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastDerivedSyncAt < DERIVED_SYNC_TTL_MS) {
    return;
  }
  lastDerivedSyncAt = now;

  const today = localTodayYmd();
  const tomorrow = addDaysYmd(today, 1);

  await Promise.all([
    syncTodayAttendanceSummaries(today),
    syncLowAttendanceStudents(),
    syncTeamsWithoutProjects(),
    syncProjectDeadlines(today, tomorrow),
    syncTaskDeadlines(today, tomorrow),
  ]);
}

async function syncTodayAttendanceSummaries(todayYmd) {
  if (isSundayYmd(todayYmd)) {
    await removeNotificationByUniqueKey(`ATTENDANCE:incomplete:${todayYmd}`);
    await removeNotificationByUniqueKey(`ATTENDANCE:absent:${todayYmd}`);
    await removeNotificationByUniqueKey(`ATTENDANCE:leave:${todayYmd}`);
    return;
  }

  const totalStudents = await Student.countDocuments();
  if (totalStudents === 0) {
    await removeNotificationByUniqueKey(`ATTENDANCE:incomplete:${todayYmd}`);
    await removeNotificationByUniqueKey(`ATTENDANCE:absent:${todayYmd}`);
    await removeNotificationByUniqueKey(`ATTENDANCE:leave:${todayYmd}`);
    return;
  }

  const { start, end } = getAttendanceDayRange(todayYmd);
  const records = await Attendance.find({
    date: { $gte: start, $lt: end },
  }).lean();

  const byStudent = new Map();
  for (const record of records) {
    const sid = String(record.student_id);
    const prev = byStudent.get(sid);
    if (!prev || new Date(record.updatedAt) > new Date(prev.updatedAt)) {
      byStudent.set(sid, record);
    }
  }

  let marked = 0;
  let absent = 0;
  let leave = 0;
  for (const record of byStudent.values()) {
    if (record.status === "Present" || record.status === "Absent" || record.status === "Leave") {
      marked += 1;
    }
    if (record.status === "Absent") absent += 1;
    if (record.status === "Leave") leave += 1;
  }

  const unmarked = Math.max(totalStudents - marked, 0);
  const incompleteKey = `ATTENDANCE:incomplete:${todayYmd}`;
  if (unmarked > 0) {
    await createNotification({
      type: "ATTENDANCE",
      title: "Attendance incomplete",
      message: `${unmarked} student${unmarked === 1 ? " has" : "s have"} not been marked for today's attendance.`,
      relatedType: "Attendance",
      uniqueKey: incompleteKey,
    });
  } else {
    await removeNotificationByUniqueKey(incompleteKey);
  }

  const absentKey = `ATTENDANCE:absent:${todayYmd}`;
  if (absent > 0) {
    await createNotification({
      type: "ATTENDANCE",
      title: "Students absent",
      message: `${absent} student${absent === 1 ? " is" : "s are"} absent today.`,
      relatedType: "Attendance",
      uniqueKey: absentKey,
    });
  } else {
    await removeNotificationByUniqueKey(absentKey);
  }

  const leaveKey = `ATTENDANCE:leave:${todayYmd}`;
  if (leave > 0) {
    await createNotification({
      type: "ATTENDANCE",
      title: "Students on leave",
      message: `${leave} student${leave === 1 ? " is" : "s are"} on leave today.`,
      relatedType: "Attendance",
      uniqueKey: leaveKey,
    });
  } else {
    await removeNotificationByUniqueKey(leaveKey);
  }
}

async function syncLowAttendanceStudents() {
  const students = await Student.find().select("name").lean();
  const activeKeys = new Set();

  for (const student of students) {
    const attendance = await Attendance.find({ student_id: student._id }).lean();
    const workingDays = attendance.filter((record) => {
      const day = new Date(record.date).getUTCDay();
      return day !== 0;
    });
    const totalDays = workingDays.length;
    if (totalDays === 0) continue;

    const presentDays = workingDays.filter((r) => r.status === "Present").length;
    const percentageRaw = (presentDays / totalDays) * 100;
    const percentage = Math.round(percentageRaw);
    const uniqueKey = `STUDENT:low_attendance:${student._id}`;

    if (percentageRaw < ACTIVE_ATTENDANCE_THRESHOLD) {
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "STUDENT",
        title: "Low attendance",
        message: `${student.name}'s attendance is below ${ACTIVE_ATTENDANCE_THRESHOLD}% (${percentage}%).`,
        relatedId: student._id,
        relatedType: "Student",
        uniqueKey,
      });
    }
  }

  // Remove recovered students' low-attendance alerts
  const existing = await Notification.find({
    uniqueKey: { $regex: /^STUDENT:low_attendance:/ },
  }).select("uniqueKey");
  for (const doc of existing) {
    if (!activeKeys.has(doc.uniqueKey)) {
      await removeNotificationByUniqueKey(doc.uniqueKey);
    }
  }
}

async function syncTeamsWithoutProjects() {
  const teams = await Team.find().select("name").lean();
  const activeKeys = new Set();

  for (const team of teams) {
    const projectCount = await Project.countDocuments({ teamId: team._id });
    const uniqueKey = `TEAM:no_project:${team._id}`;
    if (projectCount === 0) {
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "TEAM",
        title: "Team has no project",
        message: `${team.name} has no project assigned.`,
        relatedId: team._id,
        relatedType: "Team",
        uniqueKey,
      });
    }
  }

  const existing = await Notification.find({
    uniqueKey: { $regex: /^TEAM:no_project:/ },
  }).select("uniqueKey");
  for (const doc of existing) {
    if (!activeKeys.has(doc.uniqueKey)) {
      await removeNotificationByUniqueKey(doc.uniqueKey);
    }
  }
}

async function syncProjectDeadlines(today, tomorrow) {
  const projects = await Project.find().select("title dueDate status").lean();
  const activeKeys = new Set();

  for (const project of projects) {
    const dueYmd = toYmd(project.dueDate);
    if (!dueYmd || isCompletedStatus(project.status)) continue;

    if (dueYmd === tomorrow) {
      const uniqueKey = `PROJECT:deadline_tomorrow:${project._id}:${dueYmd}`;
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "PROJECT",
        title: "Project deadline",
        message: `${project.title} deadline is tomorrow.`,
        relatedId: project._id,
        relatedType: "Project",
        uniqueKey,
      });
    }

    if (dueYmd < today) {
      const uniqueKey = `PROJECT:overdue:${project._id}:${dueYmd}`;
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "PROJECT",
        title: "Project overdue",
        message: `${project.title} is overdue.`,
        relatedId: project._id,
        relatedType: "Project",
        uniqueKey,
      });
    }
  }

  const existing = await Notification.find({
    uniqueKey: { $regex: /^PROJECT:(deadline_tomorrow|overdue):/ },
  }).select("uniqueKey");
  for (const doc of existing) {
    if (!activeKeys.has(doc.uniqueKey)) {
      await removeNotificationByUniqueKey(doc.uniqueKey);
    }
  }
}

async function syncTaskDeadlines(today, tomorrow) {
  const tasks = await Task.find().select("title dueDate status").lean();
  const activeKeys = new Set();

  for (const task of tasks) {
    const dueYmd = toYmd(task.dueDate);
    if (!dueYmd || isCompletedStatus(task.status)) continue;

    if (dueYmd === tomorrow) {
      const uniqueKey = `TASK:deadline_tomorrow:${task._id}:${dueYmd}`;
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "TASK",
        title: "Task deadline",
        message: `${task.title} is due tomorrow.`,
        relatedId: task._id,
        relatedType: "Task",
        uniqueKey,
      });
    }

    if (dueYmd < today) {
      const uniqueKey = `TASK:overdue:${task._id}:${dueYmd}`;
      activeKeys.add(uniqueKey);
      await createNotification({
        type: "TASK",
        title: "Task overdue",
        message: `${task.title} is overdue.`,
        relatedId: task._id,
        relatedType: "Task",
        uniqueKey,
      });
    }
  }

  const existing = await Notification.find({
    uniqueKey: { $regex: /^TASK:(deadline_tomorrow|overdue):/ },
  }).select("uniqueKey");
  for (const doc of existing) {
    if (!activeKeys.has(doc.uniqueKey)) {
      await removeNotificationByUniqueKey(doc.uniqueKey);
    }
  }
}

/** Helpers used by other services for event notifications */
export async function notifyStudentCreated(student) {
  await createNotification({
    type: "STUDENT",
    title: "New student",
    message: `${student.name} was added as a new student.`,
    relatedId: student._id,
    relatedType: "Student",
    uniqueKey: `STUDENT:created:${student._id}`,
  });
}

export async function notifyStudentTeamChange(student, team, { previousTeamId } = {}) {
  if (!team) return;
  const moved = previousTeamId && String(previousTeamId) !== String(team._id);
  await createNotification({
    type: "STUDENT",
    title: moved ? "Student moved" : "Student assigned",
    message: moved
      ? `${student.name} was moved to ${team.name}.`
      : `${student.name} was assigned to ${team.name}.`,
    relatedId: student._id,
    relatedType: "Student",
    uniqueKey: `STUDENT:team_assigned:${student._id}:${team._id}`,
  });
}

export async function notifyTeamCreated(team) {
  await createNotification({
    type: "TEAM",
    title: "Team created",
    message: `${team.name} was created.`,
    relatedId: team._id,
    relatedType: "Team",
    uniqueKey: `TEAM:created:${team._id}`,
  });
}

export async function notifyMemberAddedToTeam(team, student) {
  await createNotification({
    type: "TEAM",
    title: "Member added",
    message: `${student.name} was added to ${team.name}.`,
    relatedId: team._id,
    relatedType: "Team",
    uniqueKey: `TEAM:member_added:${team._id}:${student._id}`,
  });
}

export async function notifyProjectCreated(project) {
  await createNotification({
    type: "PROJECT",
    title: "Project created",
    message: `${project.title} was created.`,
    relatedId: project._id,
    relatedType: "Project",
    uniqueKey: `PROJECT:created:${project._id}`,
  });
}

export async function notifyProjectStatusChanged(project, previousStatus) {
  if (!previousStatus || previousStatus === project.status) return;

  if (isCompletedStatus(project.status)) {
    await createNotification({
      type: "PROJECT",
      title: "Project completed",
      message: `${project.title} has been completed.`,
      relatedId: project._id,
      relatedType: "Project",
      uniqueKey: `PROJECT:completed:${project._id}`,
    });
    return;
  }

  await createNotification({
    type: "PROJECT",
    title: "Project status updated",
    message: `${project.title} is now ${project.status}.`,
    relatedId: project._id,
    relatedType: "Project",
    uniqueKey: `PROJECT:status:${project._id}:${project.status}`,
  });
}

export async function notifyTaskCreated(task, student) {
  const studentName = student?.name || "a student";
  await createNotification({
    type: "TASK",
    title: "Task assigned",
    message: `${task.title} was assigned to ${studentName}.`,
    relatedId: task._id,
    relatedType: "Task",
    uniqueKey: `TASK:created:${task._id}`,
  });
}

export async function notifyTaskUpdated(task, previous, student) {
  if (!previous) return;

  const prevStudentId = String(previous.studentId?._id || previous.studentId || "");
  const nextStudentId = String(task.studentId?._id || task.studentId || "");
  if (prevStudentId && nextStudentId && prevStudentId !== nextStudentId) {
    const studentName = student?.name || "a student";
    await createNotification({
      type: "TASK",
      title: "Task reassigned",
      message: `${task.title} was assigned to ${studentName}.`,
      relatedId: task._id,
      relatedType: "Task",
      uniqueKey: `TASK:assigned:${task._id}:${nextStudentId}`,
    });
  }

  const prevStatus = previous.status;
  const nextStatus = task.status;
  if (prevStatus !== nextStatus && isCompletedStatus(nextStatus)) {
    await createNotification({
      type: "TASK",
      title: "Task completed",
      message: `${task.title} has been completed.`,
      relatedId: task._id,
      relatedType: "Task",
      uniqueKey: `TASK:completed:${task._id}`,
    });
  }
}
