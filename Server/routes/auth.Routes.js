import express from "express";
import { unifiedLoginController } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const authRouter = express.Router();

// Unified login route (handles both Admin and Student credentials)
authRouter.post("/login", authLimiter, unifiedLoginController);

export default authRouter;
