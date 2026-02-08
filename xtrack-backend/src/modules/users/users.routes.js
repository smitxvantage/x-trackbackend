import { Router } from "express";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import * as controller from "./users.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "./users.validation.js";
import { upload } from "../../middleware/upload.js";

const router = Router();

/* ==============================
   AUTH REQUIRED FOR ALL
============================== */
router.use(authMiddleware);

/* ==============================
   👤 EMPLOYEE SELF ROUTES
============================== */
router.patch("/me/avatar", upload.single("avatar"), controller.uploadAvatar);

/* ==============================
   🔐 ADMIN ROUTES
============================== */
router.use(requireRole("admin"));

router.get("/", controller.listUsers);
router.get("/:id", controller.getUserById);
router.post("/", validateBody(createUserSchema), controller.createUser);
router.put("/:id", validateBody(updateUserSchema), controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
