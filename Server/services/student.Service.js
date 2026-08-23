import Student from "../models/student.Model.js";
import Attendance from "../models/attendence.Model.js";
import { Task } from "../models/taskModel.js";
import { Team } from "../models/team.Model.js";
import Project from "../models/project.Model.js";
import {
  notifyStudentCreated,
  notifyStudentTeamChange,
} from "./notification.Service.js";
import bcrypt from "bcrypt"


const ACTIVE_ATTENDANCE_THRESHOLD = 75;

async function assertTeamExists(teamId) {
  if (!teamId) return null;
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }
  return team;
}

/** Accept team_id (project field) or team (alias) — never rename DB field */
function resolveIncomingTeamId(studentData) {
  if (!studentData || typeof studentData !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(studentData, "team_id")) {
    return studentData.team_id;
  }
  if (Object.prototype.hasOwnProperty.call(studentData, "team")) {
    return studentData.team;
  }
  return undefined;
}

/** Keep Team.members in sync when student.team_id changes */
async function syncTeamMembership(studentId, oldTeamId, newTeamId) {
  const oldId = oldTeamId ? String(oldTeamId) : null;
  const newId = newTeamId ? String(newTeamId) : null;
  if (oldId === newId) return;

  if (oldId) {
    await Team.findByIdAndUpdate(oldId, { $pull: { members: studentId } });
  }
  if (newId) {
    await Team.findByIdAndUpdate(newId, { $addToSet: { members: studentId } });
  }
}

function normalizeTaskStatusLabel(status) {
  const key = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (key === "in_progress") return "In Progress";
  if (key === "completed") return "Completed";
  if (key === "pending" || key === "to_do" || key === "not_started") {
    return "Pending";
  }
  if (status === "Pending" || status === "In Progress" || status === "Completed") {
    return status;
  }
  return "Pending";
}

function computeAttendanceStats(records) {
  const workingDays = (records || []).filter((record) => {
    const day = new Date(record.date).getUTCDay();
    return day !== 0;
  });
  const totalDays = workingDays.length;
  const present = workingDays.filter((r) => r.status === "Present").length;
  const absent = workingDays.filter((r) => r.status === "Absent").length;
  const leave = workingDays.filter((r) => r.status === "Leave").length;
  const notMarked = workingDays.filter((r) => r.status === "Not marked").length;
  const percentageRaw = totalDays > 0 ? (present / totalDays) * 100 : 0;
  const percentage = Math.round(percentageRaw);
  const status =
    percentageRaw >= ACTIVE_ATTENDANCE_THRESHOLD ? "Active" : "Inactive";

  return {
    percentage,
    present,
    absent,
    leave,
    notMarked,
    totalDays,
    status,
  };
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizePhone(phone) {
  if (phone === undefined || phone === null) return "";
  return String(phone).trim();
}

function isValidEmailFormat(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// CREATE STUDENT
export const createStudent = async (studentData) => {

  const { rollNumber, name, course, batch } = studentData;

  const email = normalizeEmail(studentData.email);
  const phone = normalizePhone(studentData.phone);

  const incomingTeamId = resolveIncomingTeamId(studentData);
  // 1. Basic validation
  if (!rollNumber || !name || !course || !batch) {
    throw new Error("All fields are required");
  }
 // 2. Email validation
  if (!email) {
    throw new Error("Email is required.");
  }
  if (!isValidEmailFormat(email)) {
    throw new Error("Please provide a valid email.");
  }
//  / 3. Duplicate roll number check
  const existStudent = await Student.findOne({ rollNumber });
  if (existStudent) {
    throw new Error("User already exists");
  }
// / 4. Duplicate email check
  const existEmail = await Student.findOne({ email });
  if (existEmail) {
    throw new Error("Email already exists.");
  }

  // 5. Get default student password from .env or studentData
  const defaultPassword =
    process.env.DEFAULT_STUDENT_PASSWORD || studentData.password || "password123";

  // 6. Hash the default password
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);



// 7. Team validation
  const nextTeamId = incomingTeamId || null;
  if (nextTeamId) {
    await assertTeamExists(nextTeamId);
  }
console.log("Hashed password2:", hashedPassword);
// 8. Create student
  const student = await Student.create({
    rollNumber,
    name,
    email,
    phone,
    course,
    batch,
    team_id: nextTeamId,
    password: hashedPassword,
  });

  // 9. Sync team membership
  if (nextTeamId) {
    await syncTeamMembership(student._id, null, nextTeamId);
  }

  const populated = await Student.findById(student._id).populate(
    "team_id",
    "name",
  );


  // 11. Notifications
  await notifyStudentCreated(populated);
  if (populated.team_id) {
    await notifyStudentTeamChange(populated, populated.team_id);
  }

  return populated;
};

// GET ALL Students
export const getStudents = async ({ search }) => {
  let students;

  if (search) {
    students = await Student.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          rollNumber: Number(search),
        },
      ],
    }).populate("team_id", "name");
  } else {
    students = await Student.find().populate("team_id", "name");
  }

  return students;
};

// GET Single student by id
export const getStudentById = async (studentId) => {
  const student = await Student.findById(studentId).populate("team_id", "name");

  if (!student) {
    throw new Error("Student not found!");
  }

  return student;
};

/**
 * Full Student Profile — single efficient payload for profile page.
 * Relationships used:
 * Student.team_id → Team → members
 * Project.teamId → Team
 * Task.studentId → Student
 * Attendance.student_id → Student
 */
export const getStudentProfile = async (studentId) => {
  const student = await Student.findById(studentId).populate("team_id", "name");
  if (!student) {
    throw new Error("Student not found!");
  }

  const [attendanceRecords, tasks] = await Promise.all([
    Attendance.find({ student_id: studentId }).sort({ date: -1 }),
    Task.find({ studentId }).sort({ updatedAt: -1 }),
  ]);

  const attendance = computeAttendanceStats(attendanceRecords);

  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  for (const task of tasks) {
    const label = normalizeTaskStatusLabel(task.status);
    if (label === "Completed") completed += 1;
    else if (label === "In Progress") inProgress += 1;
    else pending += 1;
  }
  const totalTasks = tasks.length;
  const tasksCompletedPercent =
    totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  let teamPayload = null;
  let projects = [];

  if (student.team_id?._id || student.team_id) {
    const teamId = student.team_id._id || student.team_id;
    const team = await Team.findById(teamId)
      .populate("members", "name rollNumber")
      .lean();

    if (team) {
      const teamProjects = await Project.find({ teamId: team._id })
        .sort({ dueDate: 1 })
        .lean();

      projects = teamProjects.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description || "",
        status: p.status || "Not Started",
        dueDate: p.dueDate || null,
        progress: typeof p.progress === "number" ? p.progress : 0,
      }));

      teamPayload = {
        id: team._id,
        name: team.name,
        members: (team.members || [])
          .filter(Boolean)
          .map((m) => ({
            id: m._id,
            name: m.name,
            rollNumber: m.rollNumber,
          })),
        projects,
      };
    }
  }

  // Recent Performance = assigned tasks only (no attendance)
  const recentPerformance = tasks.slice(0, 20).map((t) => ({
    id: t._id,
    title: t.title,
    status: normalizeTaskStatusLabel(t.status),
    dueDate: t.dueDate || null,
    updatedAt: t.updatedAt || null,
  }));

  return {
    student: {
      id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email || "",
      phone: student.phone || "",
      course: student.course,
      batch: student.batch,
      createdAt: student.createdAt,
      team_id: student.team_id
        ? {
            _id: student.team_id._id || student.team_id,
            name: student.team_id.name || null,
          }
        : null,
    },
    status: attendance.status,
    attendance,
    academicProgress: {
      tasksCompletedPercent,
      attendancePercent: attendance.percentage,
    },
    tasks: {
      total: totalTasks,
      completed,
      inProgress,
      pending,
      items: tasks.slice(0, 20).map((t) => ({
        id: t._id,
        title: t.title,
        status: normalizeTaskStatusLabel(t.status),
        dueDate: t.dueDate || null,
        updatedAt: t.updatedAt || null,
      })),
    },
    team: teamPayload,
    projects,
    recentPerformance,
  };
};

// Update Student
export const updateStudent = async (studentId, studentData) => {
  const { rollNumber, name, course, batch } = studentData;
  const incomingTeamId = resolveIncomingTeamId(studentData);

  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found!");
  }

  if (rollNumber) {
    const existStudent = await Student.findOne({
      rollNumber,
      _id: { $ne: studentId },
    });
    if (existStudent) {
      throw new Error("Roll number already exists");
    }
    student.rollNumber = rollNumber;
  }

  if (name !== undefined) student.name = name;
  if (course !== undefined) student.course = course;
  if (batch !== undefined) student.batch = batch;

  if (Object.prototype.hasOwnProperty.call(studentData, "email")) {
    const email = normalizeEmail(studentData.email);
    if (!email) {
      throw new Error("Email is required.");
    }
    if (!isValidEmailFormat(email)) {
      throw new Error("Please provide a valid email.");
    }
    const existEmail = await Student.findOne({
      email,
      _id: { $ne: studentId },
    });
    if (existEmail) {
      throw new Error("Email already exists.");
    }
    student.email = email;
  }

  if (Object.prototype.hasOwnProperty.call(studentData, "phone")) {
    student.phone = normalizePhone(studentData.phone);
  }

  let previousTeamId = null;
  let teamChanged = false;
  if (incomingTeamId !== undefined) {
    const nextTeamId = incomingTeamId || null;
    if (nextTeamId) {
      await assertTeamExists(nextTeamId);
    }
    previousTeamId = student.team_id || null;
    const oldId = previousTeamId ? String(previousTeamId) : null;
    const newId = nextTeamId ? String(nextTeamId) : null;
    teamChanged = oldId !== newId;
    await syncTeamMembership(studentId, previousTeamId, nextTeamId);
    student.team_id = nextTeamId;
  }

  await student.save();
  const populated = await Student.findById(studentId).populate(
    "team_id",
    "name",
  );
  if (teamChanged && populated.team_id) {
    await notifyStudentTeamChange(populated, populated.team_id, {
      previousTeamId,
    });
  }
  return populated;
};

// Delete Student
export const deleteStudent = async (studendId) => {
  const student = await Student.findById(studendId);

  if (!student) {
    throw new Error("Student not found!");
  }

  if (student.team_id) {
    await Team.findByIdAndUpdate(student.team_id, {
      $pull: { members: studendId },
    });
  }

  await Student.findByIdAndDelete(studendId);

  await Attendance.deleteMany({ student_id: studendId });
  await Task.deleteMany({ studentId: studendId });

  return student;
};
