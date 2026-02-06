import { getEmployeeDashboardService } from "./employee.service.js";

export async function getEmployeeDashboard(req, res) {
  const user = req.user; // from authMiddleware

  const dashboard = await getEmployeeDashboardService(user.id);

  res.json({
    data: {
      user,
      ...dashboard,
    },
  });
}