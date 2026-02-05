import * as service from "./employeeSummary.service.js";

export async function employeeDailySummary(req, res, next) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const data = await service.getEmployeeDailySummary(today);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
