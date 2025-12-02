import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./holidays.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { createHolidaySchema, updateHolidaySchema } from "./holidays.validation.js";

const router = Router();

router.use(authMiddleware);

// Public to all authenticated (employee + admin)
router.get("/", controller.listHolidays);

// Admin only CRUD
router.post("/", requireRole("admin"), validateBody(createHolidaySchema), controller.createHoliday);
router.put("/:id", requireRole("admin"), validateBody(updateHolidaySchema), controller.updateHoliday);
router.delete("/:id", requireRole("admin"), controller.deleteHoliday);

export default router;
