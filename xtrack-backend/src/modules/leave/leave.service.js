import { db } from "../../db/index.js";
import { leaveRequests } from "../../db/schema/leaveRequests.js";
import { monthlyLeaves } from "../../db/schema/monthlyLeaves.js";
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
      startTime: payload.startTime || null,
      endTime: payload.endTime || null,
      dayType: payload.dayType || "full",
    })
    .$returningId();

  return { id: inserted.id };
}

//  🔥 UPDATED FUNCTION — returns employee name + leave details
//
export async function getAllLeaves() {
  return db
    .select({
      id: leaveRequests.id,
      userId: leaveRequests.userId,
      userName: users.name, // <-- added
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
      dayType: leaveRequests.dayType,        
      startTime: leaveRequests.startTime,    
      endTime: leaveRequests.endTime,
    })
    .from(leaveRequests)
    .leftJoin(users, eq(leaveRequests.userId, users.id));
}

// export async function updateLeaveStatus(id, adminId, payload) {
//   const update = {
//     status: payload.status,
//     approvedBy: adminId,
//     approvedAt: new Date(),
//   };

//   if (payload.status === "rejected") {
//     update.rejectionReason = payload.rejectionReason ?? null;
//   }

//   await db.update(leaveRequests).set(update).where(eq(leaveRequests.id, id));

//   return { id, status: payload.status };
// }
export async function updateLeaveStatus(id, adminId, payload) {
  const [leave] = await db
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.id, id));

  if (!leave) throw new Error("Leave not found");

  const update = {
    status: payload.status,
    approvedBy: adminId,
    approvedAt: new Date(),
    rejectionReason: payload.status === "rejected"
      ? payload.rejectionReason ?? null
      : null,
  };

  // 👉 Only calculate when APPROVED
  if (payload.status === "approved") {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, leave.userId));

    const totalEarnedLeave = user.earnedLeave;
    const appliedLeaves = Number(leave.totalDays);

    let paidLeaves = 0;
    let unpaidLeaves = 0;

    if (totalEarnedLeave === 0) {
      paidLeaves = appliedLeaves;
    } else if (appliedLeaves <= 3) {
      if (totalEarnedLeave >= appliedLeaves) {
        unpaidLeaves = appliedLeaves;
      } else {
        unpaidLeaves = totalEarnedLeave;
        paidLeaves = appliedLeaves - unpaidLeaves;
      }
    } else {
      unpaidLeaves = Math.min(3, totalEarnedLeave);
      paidLeaves = appliedLeaves - unpaidLeaves;
    }

    const remainingBalance = Math.max(totalEarnedLeave - unpaidLeaves, 0);

    // 🔹 Update earned leave
    await db
      .update(users)
      .set({ earnedLeave: remainingBalance })
      .where(eq(users.id, user.id));

    // 🔹 Insert monthly history
    const month = new Date(leave.startDate).toISOString().slice(0, 7);

    await db.insert(monthlyLeaves).values({
      userId: user.id,
      month,
      appliedLeaves,
      paidLeaves,
      unpaidLeaves,
    });
  }

  await db
    .update(leaveRequests)
    .set(update)
    .where(eq(leaveRequests.id, id));

  return { id, status: payload.status };
}
