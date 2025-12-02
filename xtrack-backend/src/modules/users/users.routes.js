import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./users.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "./users.validation.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", controller.listUsers);
router.get("/:id", controller.getUserById);
router.post("/", validateBody(createUserSchema), controller.createUser);
router.put("/:id", validateBody(updateUserSchema), controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
