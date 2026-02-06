import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./leave.controller.js";
import { validateBody } from "../../middleware/validate.js";
import {
  createLeaveSchema,
  updateLeaveStatusSchema,
} from "./leave.validation.js";

const router = Router();

/* =====================
   AUTH (ALL ROUTES)
===================== */
router.use(authMiddleware);

/* =====================
   EMPLOYEE ROUTES
===================== */
router.get("/me", controller.getMyLeaves);

router.post(
  "/",
  validateBody(createLeaveSchema),
  controller.createLeave
);

/* =====================
   ADMIN ROUTES
===================== */
router.get("/", controller.getAllLeaves);

router.post(
  "/:id/status",
  validateBody(updateLeaveStatusSchema),
  controller.updateLeaveStatus
);

// ✅ HARD DELETE (ADMIN ONLY)
router.delete(
  "/:id",
  requireRole("admin"),
  controller.deleteLeave
);

export default router;
