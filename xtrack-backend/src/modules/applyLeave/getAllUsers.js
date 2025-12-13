import { Router } from "express";
import { db } from "../../db/index.js";
import { monthlyLeaves } from "../../db/schema/monthlyLeaves.js";
import { users } from "../../db/schema/users.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/leave-history", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: monthlyLeaves.id,
        userId: monthlyLeaves.userId,
        name: users.name,
        email: users.email,
        month: monthlyLeaves.month,
        appliedLeaves: monthlyLeaves.appliedLeaves,
        paidLeaves: monthlyLeaves.paidLeaves,
        unpaidLeaves: monthlyLeaves.unpaidLeaves,
        createdAt: monthlyLeaves.createdAt,
        remainingEarnedLeave: users.earnedLeave,
      })
      .from(monthlyLeaves)
      .leftJoin(users, eq(monthlyLeaves.userId, users.id))
      .orderBy(desc(monthlyLeaves.createdAt));

    return res.json({
      status: true,
      count: rows.length,
      data: rows,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

export default router;
