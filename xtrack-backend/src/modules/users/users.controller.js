import * as service from "./users.service.js";
import { ok, created } from "../../utils/apiResponse.js";

export async function listUsers(req, res, next) {
  try {
    const data = await service.listUsers();
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const data = await service.getUserById(Number(req.params.id));
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const data = await service.createUser(req.body);
    return created(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const data = await service.updateUser(Number(req.params.id), req.body);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await service.deleteUser(Number(req.params.id));
    return ok(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
