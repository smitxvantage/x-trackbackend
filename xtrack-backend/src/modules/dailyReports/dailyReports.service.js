import { db } from "../../db/index.js";
import { dailyReports } from "../../db/schema/dailyReports.js";
import { eq, and } from "drizzle-orm";
import { users } from "../../db/schema/users.js";

export async function getReportsByUser(userId, _query) {
  const rows = await db
    .select()
    .from(dailyReports)
    .where(eq(dailyReports.userId, userId));
  return rows;
}

export async function createReport(userId, payload) {
  const result = await db.insert(dailyReports).values({
    userId,
    date: payload.date,
    tasks: payload.tasks ?? null,
    hoursWorked: payload.hoursWorked ?? 0,
    hoursSpent: payload.hoursSpent ?? 0,
    admin: payload.admin ?? null,
    attachments: payload.attachments ?? null,
    status: "submitted",
    submittedAt: new Date(),
  });

  return { id: result.insertId };
}

export async function updateOwnReport(userId, reportId, payload) {
  const { tasks, hoursSpent, admin } = payload;

  const [existing] = await db
    .select()
    .from(dailyReports)
    .where(and(eq(dailyReports.id, reportId), eq(dailyReports.userId, userId)))
    .limit(1);

  if (!existing) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  await db
    .update(dailyReports)
    .set({
      tasks,
      hoursSpent,
      admin,
      isEdited: true,
      updatedAt: new Date(),
    })
    .where(eq(dailyReports.id, reportId));

  return { id: reportId };
}

export async function getAllReports(_query) {
  const rows = await db
    .select({
      id: dailyReports.id,
      userId: dailyReports.userId,
      userName: users.name,   // ✅ THIS IS THE KEY
      date: dailyReports.date,
      tasks: dailyReports.tasks,
      hoursSpent: dailyReports.hoursSpent,
      status: dailyReports.status,
      admin: dailyReports.admin,
      createdAt: dailyReports.createdAt,
    })
    .from(dailyReports)
    .leftJoin(users, eq(dailyReports.userId, users.id));

  return rows;
}

export async function approveReport(reportId, adminId, adminName) {
  await db
    .update(dailyReports)
    .set({
      status: "approved",
      approvedBy: adminId,
      admin: adminName, // ✅ SAVE SELECTED ADMIN
      approvedAt: new Date(),
    })
    .where(eq(dailyReports.id, reportId));

  return { id: reportId, status: "approved" };
}

export async function rejectReport(reportId, adminId) {
  await db
    .update(dailyReports)
    .set({
      status: "rejected",
      approvedBy: adminId,
      approvedAt: new Date(),
    })
    .where(eq(dailyReports.id, reportId));

  return { id: reportId, status: "rejected" };
}


