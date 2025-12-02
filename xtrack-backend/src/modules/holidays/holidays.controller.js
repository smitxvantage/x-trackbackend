import * as service from "./holidays.service.js";
import { ok, created } from "../../utils/apiResponse.js";

export async function listHolidays(req, res, next) {
  try {
    const data = await service.listHolidays();
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createHoliday(req, res, next) {
  try {
    const data = await service.createHoliday(req.body);
    return created(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateHoliday(req, res, next) {
  try {
    const data = await service.updateHoliday(Number(req.params.id), req.body);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function deleteHoliday(req, res, next) {
  try {
    await service.deleteHoliday(Number(req.params.id));
    return ok(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
