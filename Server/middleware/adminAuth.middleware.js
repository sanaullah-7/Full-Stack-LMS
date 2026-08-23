import jwt from "jsonwebtoken";
import Admin from "../models/admin.Model.js";

/**
 * Admin Authentication & Authorization Middleware
 * Validates JWT, verifies admin role, and checks token version.
 */
export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required!",
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
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin access only.",
      });
    }

    // Verify Admin exists
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Check token version
    if (
      decoded.tokenVersion !== undefined &&
      admin.tokenVersion !== undefined &&
      decoded.tokenVersion !== admin.tokenVersion
    ) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid. Please login again.",
      });
    }

    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token",
    });
  }
};

export default protectAdmin;