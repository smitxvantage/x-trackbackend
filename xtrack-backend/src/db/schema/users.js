import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  date,
  datetime,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).default("employee").notNull(),
  department: varchar("department", { length: 100 }),
  managerId: int("manager_id"),
  joiningDate: date("joining_date"),
  profilePicUrl: text("profile_pic_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: datetime("created_at")
    .default(sql`NOW()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  earnedLeave: int("earned_leave").default(0).notNull(),
  lastLeaveIncrement: datetime("last_leave_increment")
    .default(sql`NOW()`)
    .notNull(),
  avatar: varchar("avatar", { length: 255 }),
});
