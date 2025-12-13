import { mysqlTable, int, varchar, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const salary = mysqlTable("salary", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  userId: int("user_id"),
  salary: int("salary").notNull(),
  createdAt: datetime("created_at").default(sql`NOW()`).notNull(),
});
