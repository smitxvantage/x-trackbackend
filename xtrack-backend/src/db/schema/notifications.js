import { mysqlTable, int, varchar, text, boolean, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  actionUrl: text("action_url"),
  createdAt: datetime("created_at").default(sql`NOW()`).notNull()
});
