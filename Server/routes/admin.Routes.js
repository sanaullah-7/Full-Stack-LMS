import express from "express";
import { loginAdminController } from "../controllers/admin.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const adminRouter = express.Router();

// Admin Login (with rate limiter)
adminRouter.post("/login", authLimiter, loginAdminController);

export default adminRouter;
