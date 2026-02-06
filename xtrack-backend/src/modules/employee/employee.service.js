import { db } from "../../db/index.js";
import { attendance } from "../../db/schema/attendance.js";
import { dailyReports } from "../../db/schema/dailyReports.js";
import { leaveRequests } from "../../db/schema/leaveRequests.js";
import { holidays } from "../../db/schema/holidays.js";
import { eq, and, sql, desc } from "drizzle-orm";

export async function getEmployeeDashboardService(userId) {
  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        eq(attendance.date, today)
      )
    )
    .limit(1);

  const pendingReports = await db
    .select()
    .from(dailyReports)
    .where(
      and(
        eq(dailyReports.userId, userId),
        eq(dailyReports.status, "submitted")
      )
    );

  const approvedLeaves = await db
    .select()
    .from(leaveRequests)
    .where(
      and(
        eq(leaveRequests.userId, userId),
        eq(leaveRequests.status, "approved")
      )
    );

  const upcomingHolidays = await db
    .select()
    .from(holidays)
    .where(sql`${holidays.date} >= ${today}`)
    .orderBy(holidays.date)
    .limit(5);

  return {
    todayAttendance: todayAttendance[0] || null,
    pendingReports: pendingReports.length,
    approvedLeaves,
    upcomingHolidays,
  };
}
