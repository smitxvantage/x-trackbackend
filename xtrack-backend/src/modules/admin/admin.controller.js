import { getEmployeeDailySummary } from "./admin.service.js";

export async function getEmployeeDailySummary(req, res) {
  const { date, userId } = req.query;

  const result = await service.getEmployeeDailySummary({
    date,
    userId,
  });

  res.json({ data: result });
}

