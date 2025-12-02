import { mysqlTable, int, datetime } from "drizzle-orm/mysql-core";
import { attendance } from "./attendance.js";

export const timeEntries = mysqlTable("time_entries", {
  id: int("id").autoincrement().primaryKey(),
  attendanceId: int("attendance_id").notNull().references(() => attendance.id),
  startTime: datetime("start_time").notNull(),
  endTime: datetime("end_time").$type(null).default(null)

});
