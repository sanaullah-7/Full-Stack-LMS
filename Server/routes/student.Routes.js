import express from "express";
import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentController,
  getStudentProfileController,
  updateStudentController,
} from "../controllers/student.controller.js";

const studentRoutes = express.Router();

studentRoutes.post("/", createStudentController);
studentRoutes.get("/", getStudentController);
// More specific than /:id
studentRoutes.get("/:id/profile", getStudentProfileController);
studentRoutes.get("/:id", getStudentByIdController);
studentRoutes.put("/:id", updateStudentController);
studentRoutes.delete("/:id", deleteStudentController);

export default studentRoutes;
