import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.Routes.js";
import adminRouter from "./routes/admin.Routes.js";
import studentRouter from "./studentmodules/studentAuth.Route.js";
import studentRoutes from "./routes/student.Routes.js";
import projectRoutes from "./routes/project.Routes.js";
import taskRoutes from "./routes/task.Routes.js";
import teamRoutes from "./routes/team.Routes.js";
import attendanceRoutes from "./routes/attendance.Routes.js";
import dashboardRouter from "./routes/dashboard.Routes.js";
import notificationRoutes from "./routes/notification.Routes.js";
import { protectAdmin } from "./middleware/adminAuth.middleware.js";
import { apiShield } from "./middleware/apiShield.middleware.js";

const app = express();

// ==========================================
// 1. SECURITY HEADERS
// ==========================================
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ==========================================
// 2. CORS CONFIGURATION
// ==========================================
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-App-Client",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ==========================================
// 3. API SHIELD (Direct Browser Access Blocker)
// Returns generic 404 for direct address bar visits
// ==========================================
app.use(apiShield);

// ==========================================
// 4. BODY PARSING & PAYLOAD LIMITS
// ==========================================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ==========================================
// 5. DATABASE CONNECTION (Serverless / Persistent)
// ==========================================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error:", error.message);
    res.status(500).json({
      success: false,
      message: "Service temporarily unavailable. Please try again later.",
    });
  }
});

// ==========================================
// 6. PUBLIC HEALTH / ROOT ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Saylani SMIT LMS API Server is running",
  });
});

// ==========================================
// 7. PUBLIC AUTHENTICATION ROUTES
// ==========================================
// Unified Auth Route (POST /api/auth/login and /auth/login)
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

// Student Portal Auth Routes
app.use("/api/student-auth", studentRouter);
app.use("/student-auth", studentRouter);

// Admin Auth Routes
app.use("/api/admin", adminRouter);
app.use("/admin", adminRouter);

// ==========================================
// 8. PROTECTED ADMIN APP ROUTES
// ==========================================
app.use("/api/student", protectAdmin, studentRoutes);
app.use("/api/tasks", protectAdmin, taskRoutes);
app.use("/api/teams", protectAdmin, teamRoutes);
app.use("/api/projects", protectAdmin, projectRoutes);
app.use("/api/attendance", protectAdmin, attendanceRoutes);
app.use("/api/dashboard", protectAdmin, dashboardRouter);
app.use("/api/notifications", protectAdmin, notificationRoutes);

// Fallback aliases without /api prefix
app.use("/student", protectAdmin, studentRoutes);
app.use("/tasks", protectAdmin, taskRoutes);
app.use("/teams", protectAdmin, teamRoutes);
app.use("/projects", protectAdmin, projectRoutes);
app.use("/attendance", protectAdmin, attendanceRoutes);
app.use("/dashboard", protectAdmin, dashboardRouter);
app.use("/notifications", protectAdmin, notificationRoutes);

// ==========================================
// 9. 404 CATCH-ALL HANDLER (Generic, No Info Leaked)
// ==========================================
app.use((req, res) => {
  if (req.accepts("html") && !req.accepts("json")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>404 Not Found</title></head>
<body><h1>404 Not Found</h1><p>The requested resource was not found on this server.</p></body>
</html>`);
  }

  return res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// ==========================================
// 10. GLOBAL PRODUCTION ERROR HANDLER (Safe JSON)
// ==========================================
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const clientMessage =
    statusCode < 500
      ? err.message || "Request could not be processed"
      : "An unexpected internal server error occurred";

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
});

export default app;
