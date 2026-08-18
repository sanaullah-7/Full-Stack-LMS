import express from "express";
import { getDashboardStatsController } from "../controllers/dashboard.controller.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/stats", getDashboardStatsController);

export default dashboardRoutes;
