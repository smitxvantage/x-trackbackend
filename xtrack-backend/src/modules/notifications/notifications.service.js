import { db } from "../../db/index.js";
import { notifications } from "../../db/schema/notifications.js";
import { eq, and } from "drizzle-orm";

export async function getNotificationsByUser(userId) {
  const rows = await db.select().from(notifications).where(eq(notifications.userId, userId));
  return rows;
}

export async function markAsRead(userId, notificationId) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

export async function createNotification(payload) {
  const [inserted] = await db
    .insert(notifications)
    .values({
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type ?? "info",
      actionUrl: payload.actionUrl ?? null
    })
    .$returningId();
  return { id: inserted.id };
}
