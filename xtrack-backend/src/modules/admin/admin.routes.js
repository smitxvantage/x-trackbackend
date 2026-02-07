import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { getEmployeeDailySummary } from "./admin.service.js";
import { getAdminDashboard, getOnLeaveDetails, getPendingReports, getAllEmployees } from "./admin.controller.js";

const router = express.Router();

router.get("/employee-daily-summary", authMiddleware, async (req, res) => {
  const data = await getEmployeeDailySummary({
    date: req.query.date,
    range: req.query.range,
    userId: req.query.userId,
  });
  res.json({ data });
});

router.get(
  "/dashboard",
  authMiddleware,
  requireRole("admin"),
  getAdminDashboard,
);
router.get(
  "/on-leave-details",
  authMiddleware,
  requireRole("admin"),
  getOnLeaveDetails,
);
router.get(
  "/pending-reports",
  authMiddleware,
  requireRole("admin"),
  getPendingReports
);
router.get(
  "/employees",
  authMiddleware,
  requireRole("admin"),
  getAllEmployees
);


export default router;
