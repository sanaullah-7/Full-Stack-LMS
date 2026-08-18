import express from "express";
import { createProjectController, deleteProjectController, getProjectByIdController, getProjectsController, updateProjectController } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProjectController);
router.get("/", getProjectsController);
router.get("/:id", getProjectByIdController);
router.put("/:id", updateProjectController);
router.delete("/:id", deleteProjectController);

export default router;