import {
  getEmployeeDailySummary as getEmployeeDailySummaryService,
  getAdminDashboardService,getOnLeaveDetailsService,getPendingReportsService,getAllEmployeesService
} from "./admin.service.js";

/**
 * GET /api/admin/employee-daily-summary
 */
export async function getAdminEmployeeDailySummary(req, res) {
  try {
    const { date, range, userId } = req.query;

    const result = await getEmployeeDailySummaryService({
      date,
      range,
      userId,
    });

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employee daily summary" });
  }
}

/**
 * GET /api/admin/dashboard
 */

export async function getAdminDashboard(req, res) {
  const data = await getAdminDashboardService();
  res.json({ data });
}

export async function getOnLeaveDetails(req, res) {
  const data = await getOnLeaveDetailsService();
  res.json({ data });
}

export async function getPendingReports(req, res) {
  const data = await getPendingReportsService();
  res.json({ data });
}

export async function getAllEmployees(req, res) {
  const data = await getAllEmployeesService();
  res.json({ data });
}