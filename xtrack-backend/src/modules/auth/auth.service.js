import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";

export async function login({ username, password }) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  };
}

// src/modules/auth/auth.service.js
export async function getMe(userId) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar, // ✅ THIS MUST EXIST
  };
}
