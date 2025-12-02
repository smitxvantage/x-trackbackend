import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users.js";

export const leaveBalances = mysqlTable("leave_balances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  leaveType: varchar("leave_type", { length: 50 }).notNull(),
  totalAllocated: int("total_allocated").notNull(),
  used: int("used").default(0).notNull(),
  year: int("year").notNull()
});
