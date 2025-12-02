import { mysqlTable, int, varchar, boolean, date } from "drizzle-orm/mysql-core";

export const holidays = mysqlTable("holidays", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull(),
  isOptional: boolean("is_optional").default(false).notNull()
});
