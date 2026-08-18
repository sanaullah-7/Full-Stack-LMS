import express from "express";
import {
    getTasks,
    getTask,
    getTasksByStudent,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

// Get all tasks
// GET /api/tasks
router.get("/", getTasks);

// Create task
// POST /api/tasks
router.post("/", createTask);

// Get tasks by student ID
// GET /api/tasks/student/:studentId
router.get("/student/:studentId", getTasksByStudent);

// Get single task by ID
// GET /api/tasks/:id
router.get("/:id", getTask);

// Update task by ID
// PUT /api/tasks/:id
router.put("/:id", updateTask);

// Delete task by ID
// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

export default router;