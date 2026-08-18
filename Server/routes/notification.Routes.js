import express from "express";
import {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// GET /api/notifications
router.get("/", listNotifications);

// GET /api/notifications/unread-count
router.get("/unread-count", unreadCount);

// PATCH /api/notifications/read-all
router.patch("/read-all", markAllRead);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", markRead);

export default router;
