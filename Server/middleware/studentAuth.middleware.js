import jwt from "jsonwebtoken";
import Student from "../models/student.Model.js";

/**
 * Student Authentication & Authorization Middleware
 * Validates JWT and verifies student role.
 */
export const protectStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify role
    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student access only.",
      });
    }

    // Verify Student exists
    const student = await Student.findById(decoded.studentId);
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student account not found",
      });
    }

    req.student = {
      id: student._id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      role: "student",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token",
    });
  }
};

export default protectStudent;
