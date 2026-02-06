import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { getEmployeeDashboard } from "./employee.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/dashboard", getEmployeeDashboard);

export default router;
