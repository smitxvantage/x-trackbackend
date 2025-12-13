import { mysqlTable, int, varchar, datetime, decimal } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const monthlyLeaves = mysqlTable("leave_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // <-- "2025-12"
  appliedLeaves: decimal("applied_leaves", {
    precision: 4,
    scale: 1,
  }).notNull(),
  paidLeaves: decimal("paid_leaves", { precision: 4, scale: 1 }).notNull(),
  unpaidLeaves: decimal("unpaid_leaves", { precision: 4, scale: 1 }).notNull(),
  createdAt: datetime("created_at")
    .default(sql`NOW()`)
    .notNull(),
});
