import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as controller from "./leave.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { createLeaveSchema, updateLeaveStatusSchema } from "./leave.validation.js";

const router = Router();

router.use(authMiddleware);

// Employee
router.get("/me", controller.getMyLeaves);
router.post("/", validateBody(createLeaveSchema), controller.createLeave);

// ALL users get leaves (admin gets all, employees get filtered)
router.get("/", controller.getAllLeaves);

// Admin only
router.post("/:id/status", validateBody(updateLeaveStatusSchema), controller.updateLeaveStatus);

export default router;
