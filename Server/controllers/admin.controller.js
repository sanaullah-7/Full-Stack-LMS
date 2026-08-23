import { unifiedLogin } from "../services/unifiedAuth.Service.js";

export const loginAdminController = async (req, res) => {
  try {
    const { email, identifier, rollNumber, password } = req.body;
    const loginIdentifier = email || identifier || rollNumber;

    // Check fields
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!",
      });
    }

    // Login (supports Admin and fallback for Student)
    const result = await unifiedLogin(loginIdentifier, password);
    return res.status(200).json({
      success: true,
      message: `${result.role === "admin" ? "Admin" : "Student"} login successful`,
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};