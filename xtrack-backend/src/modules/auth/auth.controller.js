import * as authService from "./auth.service.js";
import { ok } from "../../utils/apiResponse.js";

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return ok(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const me = await authService.getMe(req.user.id);
    return ok(res, me);
  } catch (err) {
    next(err);
  }
}
