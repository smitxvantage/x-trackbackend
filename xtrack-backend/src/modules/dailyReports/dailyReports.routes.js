import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./dailyReports.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { createDailyReportSchema, updateDailyReportSchema } from "./dailyReports.validation.js";

const router = Router();

router.use(authMiddleware);

// Employee
router.get("/me", controller.getMyReports);
router.post("/", validateBody(createDailyReportSchema), controller.createReport);
router.put("/:id", validateBody(updateDailyReportSchema), controller.updateMyReport);

// Admin
router.get("/", requireRole("admin"), controller.getAllReports);
router.post("/:id/approve", requireRole("admin"), controller.approveReport);
router.post("/:id/reject", requireRole("admin"), controller.rejectReport);

export default router;
