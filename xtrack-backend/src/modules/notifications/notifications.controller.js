import * as service from "./notifications.service.js";
import { ok, created } from "../../utils/apiResponse.js";

export async function getMyNotifications(req, res, next) {
  try {
    const data = await service.getNotificationsByUser(req.user.id);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    await service.markAsRead(req.user.id, Number(req.params.id));
    return ok(res, { read: true });
  } catch (err) {
    next(err);
  }
}

export async function createNotification(req, res, next) {
  try {
    const data = await service.createNotification(req.body);
    return created(res, data);
  } catch (err) {
    next(err);
  }
}
