import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.Routes.js";
import projectRoutes from "./routes/project.Routes.js";
import taskRoutes from "./routes/task.Routes.js";
import teamRoutes from "./routes/team.Routes.js";
import adminRouter from "./routes/admin.Routes.js";
import { protectAdmin } from "./middleware/auth.middleware.js";
import attendanceRoutes from "./routes/attendance.Routes.js";
import dashboardRouter from "./routes/dashboard.Routes.js";
import notificationRoutes from "./routes/notification.Routes.js";

const app = express();

// Middlewares
app.use(express.json());

// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// // Handle OPTIONS preflight requests IMMEDIATELY — no DB needed
// app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors());

// Middleware to ensure DB connection on serverless environments like Vercel
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      errorMessage: "Database Connection Failed", 
      details: error.message 
    });
  }
});

// Base Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// App Routes
app.use("/api/admin", adminRouter);
app.use("/api/student", protectAdmin, studentRoutes);
app.use("/api/tasks", protectAdmin, taskRoutes);
app.use("/api/teams", protectAdmin, teamRoutes);
app.use("/api/projects", protectAdmin, projectRoutes);
app.use("/api/attendance", protectAdmin, attendanceRoutes);
app.use("/api/dashboard", protectAdmin, dashboardRouter);
app.use("/api/notifications", protectAdmin, notificationRoutes);

// App instance ko export karein taake server.js ya test files ise use kar sakein
export default app;
