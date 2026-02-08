import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function listUsers() {
  const rows = await db.select().from(users);
  return rows;
}

export async function getUserById(id) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!row) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return row;
}

export async function createUser(payload) {
  const hashed = await bcrypt.hash(payload.password, 10);
  const [inserted] = await db
    .insert(users)
    .values({
      name: payload.name,
      email: payload.email,
      username: payload.username,
      password: hashed,
      role: payload.role ?? "employee",
      department: payload.department ?? null,
      managerId: payload.managerId ?? null,
      joiningDate: payload.joiningDate ?? null,
      earnedLeave: 0,
      lastLeaveIncrement: new Date(),
    })
    .$returningId();
  return { id: inserted.id };
}

export async function updateUser(id, payload) {
  const data = { ...payload };

  // hash password if present
  if (payload.password) {
    data.password = await bcrypt.hash(payload.password, 10);
  } else {
    delete data.password;
  }

  // 🔥 IMPORTANT: prevent empty update
  if (Object.keys(data).length === 0) {
    return getUserById(id);
  }

  await db.update(users).set(data).where(eq(users.id, id));
  return getUserById(id);
}

export async function deleteUser(id) {
  await db.delete(users).where(eq(users.id, id));
}
