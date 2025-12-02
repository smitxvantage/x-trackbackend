import { db } from "../../db/index.js";
import { leaveRequests } from "../../db/schema/leaveRequests.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";

export async function getLeavesByUser(userId) {
  return db
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, userId));
}

export async function createLeave(userId, payload) {
  const [inserted] = await db
    .insert(leaveRequests)
    .values({
      userId,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalDays: payload.totalDays,
      reason: payload.reason,
      status: "pending",
    })
    .$returningId();

  return { id: inserted.id };
}

//
//  🔥 UPDATED FUNCTION — returns employee name + leave details
//
export async function getAllLeaves() {
  return db
    .select({
      id: leaveRequests.id,
      userId: leaveRequests.userId,
      userName: users.name,              // <-- added
      leaveType: leaveRequests.leaveType,
      startDate: leaveRequests.startDate,
      endDate: leaveRequests.endDate,
      totalDays: leaveRequests.totalDays,
      reason: leaveRequests.reason,
      status: leaveRequests.status,
      approvedBy: leaveRequests.approvedBy,
      approvedAt: leaveRequests.approvedAt,
      rejectionReason: leaveRequests.rejectionReason,
      createdAt: leaveRequests.createdAt,
      updatedAt: leaveRequests.updatedAt,
    })
    .from(leaveRequests)
    .leftJoin(users, eq(leaveRequests.userId, users.id));
}

export async function updateLeaveStatus(id, adminId, payload) {
  const update = {
    status: payload.status,
    approvedBy: adminId,
    approvedAt: new Date(),
  };

  if (payload.status === "rejected") {
    update.rejectionReason = payload.rejectionReason ?? null;
  }

  await db.update(leaveRequests)
    .set(update)
    .where(eq(leaveRequests.id, id));

  return { id, status: payload.status };
}
