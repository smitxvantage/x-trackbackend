import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";

import {
  getMyAttendance,
  getMySummary,
  checkIn,
  checkOut,
  getAllAttendance,
} from "./attendance.controller.js";

const router = Router();

router.use(authMiddleware);

// USER ROUTES
router.get("/me", getMyAttendance);
router.get("/my-summary", getMySummary);
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

// ADMIN ROUTE
router.get("/", getAllAttendance);

export default router;
