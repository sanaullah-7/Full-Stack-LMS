import express from "express";
import {
  changeStudentPasswordController,
  getMyAttendanceController,
  getMyNotificationsController,
  getMyProjectsController,
  getMyTasksController,
  getMyTeamController,
  getStudentDashboardController,
  getStudentMeController,
  loginStudentController,
  markAllNotificationsAsReadController,
  updateMyTaskStatusController,
} from "./studentAuth.controller.js";
import { protectStudent } from "../middleware/studentAuth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const studentRouter = express.Router();

// public login route (with auth rate limiting)
studentRouter.post("/login", authLimiter, loginStudentController);

// private routes
studentRouter.get("/me", protectStudent, getStudentMeController);
studentRouter.get("/attendance", protectStudent, getMyAttendanceController);
studentRouter.get("/dashboard", protectStudent, getStudentDashboardController);
studentRouter.get("/tasks", protectStudent, getMyTasksController);
studentRouter.patch("/task/status", protectStudent, updateMyTaskStatusController);
studentRouter.get("/projects", protectStudent, getMyProjectsController);
studentRouter.get("/team", protectStudent, getMyTeamController);
studentRouter.patch("/change-password", protectStudent, changeStudentPasswordController);
studentRouter.get("/notifications", protectStudent, getMyNotificationsController);
studentRouter.patch("/read-all", protectStudent, markAllNotificationsAsReadController);

export default studentRouter;