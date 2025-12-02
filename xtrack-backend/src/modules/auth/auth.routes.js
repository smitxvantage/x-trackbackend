import { Router } from "express";
import { login, getMe } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.get("/me", authMiddleware, getMe);

export default router;
