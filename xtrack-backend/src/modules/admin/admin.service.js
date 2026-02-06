import { db } from "../../db/index.js";
import { dailyReports } from "../../db/schema/dailyReports.js";
import { attendance } from "../../db/schema/attendance.js";
import { users } from "../../db/schema/users.js";
import { leaveRequests } from "../../db/schema/leaveRequests.js";
import { eq, and, sql, desc } from "drizzle-orm";


export async function getEmployeeDailySummary({
  date,
  range = "day",
  userId,
} = {}) {
  const baseDate = date
    ? new Date(date)
    : new Date();

  // 🔹 Convert to YYYY-MM-DD
  const format = (d) => d.toISOString().split("T")[0];

  let startDate = format(baseDate);
  let endDate = format(baseDate);

  if (range === "week") {
    const day = baseDate.getDay();
    const start = new Date(baseDate);
    start.setDate(baseDate.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    startDate = format(start);
    endDate = format(end);
  }

  if (range === "month") {
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    startDate = format(start);
    endDate = format(end);
  }

  // 1️⃣ Active users
  const usersList = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.isActive, true));

  const filteredUsers = userId
    ? usersList.filter((u) => u.id === Number(userId))
    : usersList;

  // 2️⃣ Attendance
  const attendanceRows = await db
    .select()
    .from(attendance)
    .where(
      and(
        sql`DATE(${attendance.date}) >= ${startDate}`,
        sql`DATE(${attendance.date}) <= ${endDate}`
      )
    );

  // 3️⃣ Daily reports
  const reports = await db
    .select()
    .from(dailyReports)
    .where(
      and(
        sql`DATE(${dailyReports.date}) >= ${startDate}`,
        sql`DATE(${dailyReports.date}) <= ${endDate}`
      )
    );

  // 4️⃣ Leaves
  const leaves = await db
    .select({ userId: leaveRequests.userId })
    .from(leaveRequests)
    .where(
      and(
        sql`${leaveRequests.startDate} <= ${endDate}`,
        sql`${leaveRequests.endDate} >= ${startDate}`
      )
    );

  const attendanceMap = {};
  attendanceRows.forEach((a) => (attendanceMap[a.userId] = a));

  const leaveMap = {};
  leaves.forEach((l) => (leaveMap[l.userId] = true));

  // 5️⃣ Build summary
  return filteredUsers.map((user) => {
    const userReports = reports.filter((r) => r.userId === user.id);

    return {
      userId: user.id,
      userName: user.name,
      date: startDate,

      checkIn: attendanceMap[user.id]?.checkIn || null,
      checkOut: attendanceMap[user.id]?.checkOut || null,

      approvedCount: userReports.filter((r) => r.status === "approved").length,
      pendingCount: userReports.filter((r) => r.status === "submitted").length,

      tasks: userReports.map((r) => ({
        task: r.tasks,
        status: r.status,
        minutes: r.hoursSpent || 0,
      })),

      totalEstimatedMinutes: userReports.reduce(
        (sum, r) => sum + (r.hoursSpent || 0),
        0
      ),

      isHoliday: !!leaveMap[user.id],
    };
  });
}

export async function getAdminDashboardService() {
  const today = new Date().toISOString().split("T")[0];

  // 1️⃣ Total employees
  const totalEmployees = await db
    .select({ count: sql`COUNT(*)` })
    .from(users)
    .then(r => Number(r[0].count));

  // 2️⃣ On leave today
  const onLeaveToday = await db
    .select({ count: sql`COUNT(DISTINCT ${leaveRequests.userId})` })
    .from(leaveRequests)
    .where(
      and(
        eq(leaveRequests.status, "approved"),
        sql`${leaveRequests.startDate} <= ${today}`,
        sql`${leaveRequests.endDate} >= ${today}`
      )
    )
    .then(r => Number(r[0].count));

  // 3️⃣ Pending daily reports
  const pendingReports = await db
    .select({ count: sql`COUNT(*)` })
    .from(dailyReports)
    .where(eq(dailyReports.status, "submitted"))
    .then(r => Number(r[0].count));

  // 4️⃣ 🔥 RECENT DAILY REPORTS (THIS WAS BROKEN)
  const recentReports = await db
    .select({
      id: dailyReports.id,
      userName: users.name,
      tasks: dailyReports.tasks,
      hoursSpent: dailyReports.hoursSpent,
      createdAt: dailyReports.createdAt,
    })
    .from(dailyReports)
    .leftJoin(users, eq(users.id, dailyReports.userId))
    .orderBy(desc(dailyReports.createdAt))
    .limit(5); // 👈 very important

  // 5️⃣ Pending leaves
  const pendingLeaves = await db
    .select({
      id: leaveRequests.id,
      userName: users.name,
      leaveType: leaveRequests.leaveType,
      startDate: leaveRequests.startDate,
      endDate: leaveRequests.endDate,
    })
    .from(leaveRequests)
    .leftJoin(users, eq(users.id, leaveRequests.userId))
    .where(eq(leaveRequests.status, "pending"))
    .orderBy(desc(leaveRequests.createdAt))
    .limit(5);

  return {
    stats: {
      totalEmployees,
      onLeaveToday,
      pendingReports,
    },
    recentReports,
    pendingLeaves,
  };
}