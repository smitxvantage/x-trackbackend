import { db } from "../../db/index.js";
import { attendance } from "../../db/schema/attendance.js";
import { users } from "../../db/schema/users.js";
import { eq, and, desc, gte, lte ,isNull} from "drizzle-orm";
import moment from "moment";

/* -------------------------
   GET MY ATTENDANCE
-------------------------- */
export async function getAttendanceByUser(userId) {
  return db
    .select()
    .from(attendance)
    .where(eq(attendance.userId, userId))
    .orderBy(desc(attendance.id));
}

/* -------------------------
   CHECK IN (SAFE)
-------------------------- */

export async function checkIn(userId) {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("HH:mm");

  // ✅ CORRECT NULL CHECK
  const openSession = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        isNull(attendance.checkOut)
      )
    )
    .orderBy(desc(attendance.id))
    .limit(1);

  if (openSession.length) {
    throw new Error("Already checked in");
  }

  await db.insert(attendance).values({
    userId,
    date: today,
    checkIn: now,
    checkOut: null,
    totalHours: null,
    status: "working",
  });

  return { message: "Checked in" };
}



/* -------------------------
   CHECK OUT (CORRECT)
-------------------------- */
export async function checkOut(userId) {
  const now = moment().format("HH:mm");

  // ✅ CORRECT NULL CHECK
  const openSession = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        isNull(attendance.checkOut)
      )
    )
    .orderBy(desc(attendance.id))
    .limit(1);

  if (!openSession.length) {
    throw new Error("Not checked in");
  }

  const session = openSession[0];

  const start = moment(session.checkIn, "HH:mm");
  const end = moment(now, "HH:mm");

  const minutes = Math.max(end.diff(start, "minutes"), 0);
  const hours = Number((minutes / 60).toFixed(2));

  await db
    .update(attendance)
    .set({
      checkOut: now,
      totalHours: hours,
      status: "completed",
    })
    .where(eq(attendance.id, session.id));

  return { message: "Checked out" };
}


/* -------------------------
   TODAY HOURS
-------------------------- */
export async function getTodayMinutes(userId) {
  const today = moment().format("YYYY-MM-DD");

  const rows = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.userId, userId), eq(attendance.date, today)));

  let minutes = 0;
  rows.forEach(r => minutes += Math.round((r.totalHours || 0) * 60));
  return minutes;
}

/* -------------------------
   WEEKLY HOURS
-------------------------- */
export async function getWeeklyHours(userId) {
  const start = moment().startOf("week").format("YYYY-MM-DD");
  const end = moment().endOf("week").format("YYYY-MM-DD");

  const rows = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.userId, userId),
        gte(attendance.date, start),
        lte(attendance.date, end)
      )
    );

  let hours = 0;
  rows.forEach(r => hours += Number(r.totalHours || 0));
  return { weeklyHours: hours };
}

/* -------------------------
   ADMIN
-------------------------- */
export async function getAllAttendance() {
  return db
    .select({
      user: users.name,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      hours: attendance.totalHours,
    })
    .from(attendance)
    .leftJoin(users, eq(attendance.userId, users.id));
}
