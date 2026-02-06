import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import {
  getMyAttendance,
  getMySummary,
  checkIn,
  checkOut,
  pauseSession,
  resumeSession,
  getAllAttendance,
} from "./attendance.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyAttendance);
router.get("/my-summary", getMySummary);

router.post("/check-in", checkIn);
router.post("/pause", pauseSession);
router.post("/resume", resumeSession);
router.post("/check-out", checkOut);

router.get("/", getAllAttendance);

export default router;
