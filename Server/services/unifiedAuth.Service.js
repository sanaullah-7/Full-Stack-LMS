import Admin from "../models/admin.Model.js";
import Student from "../models/student.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

/**
 * Unified Authentication Service
 * Validates credentials against Admin first, then Student collection.
 * Generates appropriate role-based JWT and returns formatted profile.
 */
export const unifiedLogin = async (identifier, password) => {
  const clean = String(identifier || "").trim();
  if (!clean || !password) {
    throw new Error("Email/Roll Number and Password are required.");
  }

  // 1. Check if user is an Admin (by email)
  const admin = await Admin.findOne({ email: clean.toLowerCase() });
  if (admin) {
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid email/roll number or password");
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: "admin",
        tokenVersion: admin.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      role: "admin",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
      targetPortal: "admin",
      redirectUrl: "/dashboard",
    };
  }

  // 2. Check if user is a Student (by email or rollNumber)
  const student = await Student.findOne({
    $or: [{ email: clean.toLowerCase() }, { rollNumber: clean }],
  }).populate("team_id", "name");

  if (student) {
    const isPasswordCorrect = await bcrypt.compare(password, student.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid email/roll number or password");
    }

    const token = generateToken(student);

    return {
      token,
      role: "student",
      student: {
        id: student._id,
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone || "",
        rollNumber: student.rollNumber,
        course: student.course,
        batch: student.batch,
        team: student.team_id,
        role: "student",
      },
      user: {
        id: student._id,
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        role: "student",
      },
      targetPortal: "student",
      redirectUrl: "/dashboard",
    };
  }

  // 3. Neither admin nor student matched
  throw new Error("Invalid email/roll number or password");
};
