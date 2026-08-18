import express from "express";

import {
  getAttendanceByDateController,
  getOverallAttendanceStatusController,
  getStudentAttendanceHistoryController,
  markAttendanceController,
} from "../controllers/attendance.controller.js";

const attendanceRoutes = express.Router();

// Mark / Update , Save attendance
attendanceRoutes.post("/", markAttendanceController);

// Static GET routes MUST be registered before "/:date"
attendanceRoutes.get("/stats/overall", getOverallAttendanceStatusController);
attendanceRoutes.get("/student/:studentId", getStudentAttendanceHistoryController);

// Get attendance by date (YYYY-MM-DD)
attendanceRoutes.get("/:date", getAttendanceByDateController);

export default attendanceRoutes;
