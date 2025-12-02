import { db } from "../../db/index.js";
import { holidays } from "../../db/schema/holidays.js";
import { eq } from "drizzle-orm";

export async function listHolidays() {
  return db.select().from(holidays);
}

export async function createHoliday(payload) {
  const [inserted] = await db.insert(holidays).values({
    name: payload.name,
    date: payload.date,
    isOptional: payload.isOptional ?? false
  }).$returningId();
  return { id: inserted.id };
}

export async function updateHoliday(id, payload) {
  await db.update(holidays).set(payload).where(eq(holidays.id, id));
  return { id };
}

export async function deleteHoliday(id) {
  await db.delete(holidays).where(eq(holidays.id, id));
}
