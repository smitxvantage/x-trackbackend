import { db } from "../../db/index.js";
import { attendance } from "../../db/schema/attendance.js";
import { users } from "../../db/schema/users.js";
import { eq, and, gte, lte } from "drizzle-orm";
import moment from "moment";

// ----------------------------------------------
// USER: FETCH MY ATTENDANCE LIST
// ----------------------------------------------
export async function getAttendanceByUser(userId) {
  return db
    .select({
      id: attendance.id,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      totalHours: attendance.totalHours,
      status: attendance.status,
    })
    .from(attendance)
    .where(eq(attendance.userId, userId))
    .orderBy(attendance.date);
}

// ----------------------------------------------
// USER: MONTHLY SUMMARY
// ----------------------------------------------
export async function getMonthlySummary(userId) {
  const monthStart = moment().startOf("month").format("YYYY-MM-DD");
  const monthEnd = moment().endOf("month").format("YYYY-MM-DD");

  const rows = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        gte(attendance.date, monthStart),
        lte(attendance.date, monthEnd)
      )
    );

  return {
    present: rows.filter(r => r.status === "on-time").length,
    late: rows.filter(r => r.status === "late").length,
    absent: 0,
  };
}

// ----------------------------------------------
// ADMIN: MERGED DAILY ATTENDANCE
// ----------------------------------------------
export async function getAllAttendance() {
  const rows = await db
    .select({
      id: attendance.id,
      userId: attendance.userId,
      userName: users.name,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      totalHours: attendance.totalHours,
    })
    .from(attendance)
    .leftJoin(users, eq(attendance.userId, users.id));

  const grouped = {};

  for (const r of rows) {
    const d = r.date.toISOString().split("T")[0];
    const key = `${r.userId}_${d}`;

    if (!grouped[key]) {
      grouped[key] = {
        userId: r.userId,
        userName: r.userName,
        date: d,
        firstCheckIn: r.checkIn,
        lastCheckOut: r.checkOut,
        totalHours: Number(r.totalHours ?? 0),
      };
    } else {
      if (r.checkIn && r.checkIn < grouped[key].firstCheckIn) {
        grouped[key].firstCheckIn = r.checkIn;
      }
      if (r.checkOut && r.checkOut > grouped[key].lastCheckOut) {
        grouped[key].lastCheckOut = r.checkOut;
      }

      grouped[key].totalHours += Number(r.totalHours ?? 0);
    }
  }

  return Object.values(grouped);
}

// ----------------------------------------------
// CHECK-IN
// ----------------------------------------------
export async function checkIn(userId) {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("HH:mm");

  await db.insert(attendance).values({
    userId,
    date: today,
    checkIn: now,
    status: "on-time",
  });

  return { message: "Checked in" };
}

// ----------------------------------------------
// CHECK-OUT
// ----------------------------------------------
export async function checkOut(userId) {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("HH:mm");

  const rows = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.userId, userId), eq(attendance.date, today)));

  if (rows.length === 0) {
    throw new Error("Cannot check-out — no check-in found");
  }

  const lastEntry = rows[rows.length - 1];

  const start = moment(lastEntry.checkIn, "HH:mm");
  const end = moment(now, "HH:mm");

  const diffHours = Number((end.diff(start, "minutes") / 60).toFixed(2));

  await db
    .update(attendance)
    .set({
      checkOut: now,
      totalHours: diffHours,
    })
    .where(eq(attendance.id, lastEntry.id));

  return { message: "Checked out" };
}
