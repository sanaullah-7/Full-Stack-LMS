import { unifiedLogin } from "../services/unifiedAuth.Service.js";

/**
 * Unified Login Controller for /api/auth/login
 */
export const unifiedLoginController = async (req, res) => {
  try {
    const { identifier, email, rollNumber, password } = req.body;
    const loginIdentifier = identifier || email || rollNumber;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Roll Number and password are required",
      });
    }

    const result = await unifiedLogin(loginIdentifier, password);

    return res.status(200).json({
      success: true,
      message: `${result.role === "admin" ? "Admin" : "Student"} login successful`,
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
};
