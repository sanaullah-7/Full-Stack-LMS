import express from "express";
import { loginAdminController } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// Admin Login
adminRouter.post("/login", loginAdminController);

export default adminRouter;

