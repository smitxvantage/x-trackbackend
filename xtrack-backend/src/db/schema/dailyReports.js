import { mysqlTable, int, varchar, timestamp, text, boolean, date, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

export const dailyReports = mysqlTable("daily_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  hoursWorked: int("hours_worked"),
  attachments: text("attachments"),
  status: varchar("status", { length: 50 }).default("draft").notNull(),
  isEdited: boolean("is_edited").default(false).notNull(),
  submittedAt: datetime("submitted_at", { mode: "date" }).default(null),
  approvedAt: datetime("approved_at", { mode: "date" }).default(null),
  description: text("description"),

  approvedBy: int("approved_by"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  tasks: text("tasks"),
  hoursSpent: int("hoursSpent").default(0),
  admin: varchar("admin", { length: 255 }),
  reportType: varchar("reportType", { length: 255 })
});
