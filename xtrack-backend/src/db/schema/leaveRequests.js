import { mysqlTable, int, varchar, text, date, datetime, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

export const leaveRequests = mysqlTable("leave_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  leaveType: varchar("leave_type", { length: 50 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: int("total_days").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  approvedBy: int("approved_by"),
  approvedAt: datetime("approved_at", { mode: "date" }).default(null),
  rejectionReason: text("rejection_reason"),
  createdAt: datetime("created_at").default(sql`NOW()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull()
});
