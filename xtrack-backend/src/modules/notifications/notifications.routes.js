import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./notifications.controller.js";

const router = Router();

router.use(authMiddleware);

// Employee: own notifications
router.get("/me", controller.getMyNotifications);
router.post("/me/:id/read", controller.markAsRead);

// Admin: create notifications for users
router.post("/", requireRole("admin"), controller.createNotification);

export default router;
