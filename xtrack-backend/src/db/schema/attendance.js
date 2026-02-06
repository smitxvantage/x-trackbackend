import {
  mysqlTable,
  int,
  varchar,
  date,
  datetime,
  boolean,
} from "drizzle-orm/mysql-core";

export const attendance = mysqlTable("attendance", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id"),
  date: date("date"),
  checkIn: varchar("check_in", { length: 10 }),
  checkOut: varchar("check_out", { length: 10 }),
  totalHours: varchar("total_hours", { length: 10 }),
  status: varchar("status", { length: 20 }),

  // NEW SYSTEM
  checkInAt: datetime("check_in_at"),
  pausedAt: datetime("paused_at"),
  totalPausedSeconds: int("total_paused_seconds").default(0),
  isPaused: boolean("is_paused").default(false),
});
