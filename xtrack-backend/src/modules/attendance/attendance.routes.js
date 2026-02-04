import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  getMyAttendance,
  checkIn,
  checkOut,
  getWeeklyHours,
} from "./attendance.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/me", getMyAttendance);
router.get("/weekly-hours", getWeeklyHours);
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

export default router;
