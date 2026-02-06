import express from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import { getEmployeeDailySummary } from "./admin.service.js";
import { getAdminDashboard } from "./admin.controller.js";

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
  getAdminDashboard
);

export default router;
