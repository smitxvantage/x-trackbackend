import * as service from "./dailyReports.service.js";
import { ok, created } from "../../utils/apiResponse.js";

export async function getMyReports(req, res, next) {
  try {
    const data = await service.getReportsByUser(req.user.id, req.query);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createReport(req, res, next) {
  try {
    const data = await service.createReport(req.user.id, req.body);
    return created(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateMyReport(req, res, next) {
  try {
    const data = await service.updateOwnReport(
      req.user.id,
      Number(req.params.id),
      req.body,
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getAllReports(req, res, next) {
  try {
    const data = await service.getAllReports(req.query);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function approveReport(req, res, next) {
  try {
    const { admin } = req.body; // 👈 selected admin name

    if (!admin) {
      return res.status(400).json({ message: "Admin name is required" });
    }

    const data = await service.approveReport(
      Number(req.params.id),
      req.user.id,
      admin,
    );

    return ok(res, data);
  } catch (err) {
    next(err);
  }
}

export async function rejectReport(req, res, next) {
  try {
    const data = await service.rejectReport(
      Number(req.params.id),
      req.user.id,
      req.body.reason,
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
}
export const getPendingReports = async (req, res) => {
  const data = [
    { id: 1, name: "David", status: "pending" },
    { id: 2, name: "Lisa", status: "pending" },
  ];

  res.json({ success: true, data });
};
