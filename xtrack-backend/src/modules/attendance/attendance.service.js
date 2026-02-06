import { db } from "../../db/index.js";
import { attendance } from "../../db/schema/attendance.js";
import { users } from "../../db/schema/users.js";
import { eq, and, gte, lte } from "drizzle-orm";
import moment from "moment";
import { or, isNull } from "drizzle-orm";

// ----------------------------------------------
// USER: FETCH MY ATTENDANCE LIST (REFRESH SAFE)
// ----------------------------------------------
export async function getAttendanceByUser(userId) {
  const rows = await db
    .select()
    .from(attendance)
    .where(eq(attendance.userId, userId))
    .orderBy(attendance.date);

  const today = new Date().toISOString().slice(0, 10);

  const todayEntry = rows.find((r) => {
    const rowDate =
      r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date;

    return rowDate === today && r.checkInAt && !r.checkOut;
  });

  return {
    records: rows,
    activeSession: todayEntry
      ? {
          checkInAt: todayEntry.checkInAt,
          totalPausedSeconds: todayEntry.totalPausedSeconds,
          isPaused: todayEntry.isPaused,
        }
      : null,
  };
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
        lte(attendance.date, monthEnd),
      ),
    );

  return {
    present: rows.filter((r) => r.status === "on-time").length,
    late: rows.filter((r) => r.status === "late").length,
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
  const now = moment();

  await db.insert(attendance).values({
    userId,
    date: now.format("YYYY-MM-DD"),
    checkIn: now.format("HH:mm"),
    checkInAt: now.toDate(), // ✅ REQUIRED
    isPaused: false,
    totalPausedSeconds: 0,
    status: "on-time",
  });

  return {
    checkInAt: now.toISOString(),
    isPaused: false,
    totalPausedSeconds: 0,
  };
}

// ----------------------------------------------
// PAUSE SESSION
// ----------------------------------------------
export async function pauseSession(userId) {
  const entry = await db.query.attendance.findFirst({
    where: and(
      eq(attendance.userId, userId),
      isNull(attendance.checkOut),
      eq(attendance.isPaused, false),
    ),
  });

  if (!entry) {
    throw new Error("No running session to pause");
  }

  await db
    .update(attendance)
    .set({
      isPaused: true,
      pausedAt: new Date(),
    })
    .where(eq(attendance.id, entry.id));

  return {
    pausedAt: new Date().toISOString(),
  };
}

// ----------------------------------------------
// RESUME SESSION
// ----------------------------------------------
export async function resumeSession(userId) {
  const entry = await db.query.attendance.findFirst({
    where: and(
      eq(attendance.userId, userId),
      isNull(attendance.checkOut),
      eq(attendance.isPaused, true),
    ),
  });

  if (!entry || !entry.pausedAt) {
    throw new Error("No paused session to resume");
  }

  const pausedSeconds = Math.floor(
    (Date.now() - new Date(entry.pausedAt).getTime()) / 1000,
  );

  await db
    .update(attendance)
    .set({
      isPaused: false,
      pausedAt: null,
      totalPausedSeconds: Number(entry.totalPausedSeconds || 0) + pausedSeconds,
    })
    .where(eq(attendance.id, entry.id));

  return {
    resumed: true,
    totalPausedSeconds: Number(entry.totalPausedSeconds || 0) + pausedSeconds,
  };
}

// ----------------------------------------------
// CHECK-OUT
// ----------------------------------------------
export async function checkOut(userId) {
  const today = moment().format("YYYY-MM-DD");
  const now = new Date();

  const rows = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        eq(attendance.date, today),
        or(isNull(attendance.checkOut), eq(attendance.checkOut, "")),
      ),
    )
    .limit(1);

  if (!rows.length) {
    throw new Error("No active session found");
  }

  const entry = rows[0];

  if (!entry.checkInAt) {
    throw new Error("checkInAt missing");
  }

  const startMs = new Date(entry.checkInAt).getTime();
  const endMs = now.getTime();

  const workedSeconds =
    Math.floor((endMs - startMs) / 1000) -
    Number(entry.totalPausedSeconds || 0);

  const totalHours = Number((workedSeconds / 3600).toFixed(2));

  await db
    .update(attendance)
    .set({
      checkOut: moment(now).format("HH:mm"),
      totalHours,
      isPaused: false,
      pausedAt: null,
    })
    .where(eq(attendance.id, entry.id));

  return {
    totalHours,
    checkOutAt: now.toISOString(),
  };
}
