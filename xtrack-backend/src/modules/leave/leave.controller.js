import * as service from "./leave.service.js";
import { ok, created } from "../../utils/apiResponse.js";

export async function getMyLeaves(req, res, next) {
  try {
    const data = await service.getLeavesByUser(req.user.id);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createLeave(req, res, next) {
  try {
    const data = await service.createLeave(req.user.id, req.body);
    return created(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getAllLeaves(req, res, next) {
  try {
    let data = await service.getAllLeaves();

    // Employee sees only approved
    if (req.user.role !== "admin") {
      data = data.filter(l => l.status === "approved");
    }

    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateLeaveStatus(req, res, next) {
  try {
    const data = await service.updateLeaveStatus(
      Number(req.params.id),
      req.user.id,
      req.body
    );

    return ok(res, data);
  } catch (err) {
    next(err);
  }
}
