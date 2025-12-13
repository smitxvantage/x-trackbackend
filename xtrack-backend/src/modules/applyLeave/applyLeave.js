import { Router } from "express";
import { users } from "../../db/schema/users.js";
import jwt from "jsonwebtoken";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { monthlyLeaves } from "../../db/schema/monthlyLeaves.js";
import { createLeave } from "../leave/leave.service.js";
const router = Router();
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token invalid", error: err.message });
  }
};
router.use(authMiddleware);
function monthDiff(lastDate) {
  const last = new Date(lastDate);
  const now = new Date();

  return (
    (now.getFullYear() - last.getFullYear()) * 12 +
    (now.getMonth() - last.getMonth())
  );
}

async function incrementMonthlyLeaves(user) {
  const months = monthDiff(user.lastLeaveIncrement);

  if (months > 0) {
    const newBalance = user.earnedLeave + months;

    await db
      .update(users)
      .set({
        earnedLeave: newBalance,
        lastLeaveIncrement: new Date(),
      })
      .where(eq(users.id, user.id));

    return newBalance;
  }

  return user.earnedLeave;
}

router.post("/apply-leave", async (req, res) => {
  try {
    const { appliedLeaves } = req.body;
    const userId = Number(req.user.id || req.user.userId);

    if (typeof appliedLeaves !== "number") {
      return res.status(400).json({
        status: false,
        message: "appliedLeaves must be a number",
      });
    }

    // Fetch user
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Auto earned leave increment
    const totalEarnedLeave = await incrementMonthlyLeaves(user);

    let paidLeaves = 0;
    let unpaidLeaves = 0;

    if (totalEarnedLeave === 0) {
      unpaidLeaves = 0;
      paidLeaves = appliedLeaves;
    } else if (appliedLeaves <= 3) {
      if (totalEarnedLeave >= appliedLeaves) {
        unpaidLeaves = appliedLeaves;
        paidLeaves = 0;
      } else {
        unpaidLeaves = totalEarnedLeave;
        paidLeaves = appliedLeaves - unpaidLeaves;
      }
    } else {
      const unpaidAttempt = Math.min(3, totalEarnedLeave);
      unpaidLeaves = unpaidAttempt;

      const remaining = appliedLeaves - unpaidLeaves;

      paidLeaves = remaining;
    }

    const remainingBalance = Math.max(totalEarnedLeave - unpaidLeaves, 0);

    await db
      .update(users)
      .set({ earnedLeave: remainingBalance })
      .where(eq(users.id, userId));

    return res.json({
      status: true,
      message: "Leave calculated successfully",
      data: {
        appliedLeaves,
        paidLeaves,
        unpaidLeaves,
        previousEarnedLeave: totalEarnedLeave,
        remainingEarnedLeave: remainingBalance,
      },
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
