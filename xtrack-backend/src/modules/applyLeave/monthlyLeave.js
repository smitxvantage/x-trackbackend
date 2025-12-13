import { Router } from "express";
import { db } from "../../db/index.js";
import { and, eq } from "drizzle-orm";
import { monthlyLeaves } from "../../db/schema/monthlyLeaves.js";

const router = Router();

router.get("/monthly-leaves", async (req, res) => {
  try {
    const userId = Number(req.user.id || req.user.userId);
    const { month } = req.query; // expected format: "2025-01"

    if (!month || month.length !== 7) {
      return res.status(400).json({
        status: false,
        message: "month must be in YYYY-MM format",
      });
    }

    const [record] = await db
      .select()
      .from(monthlyLeaves)
      .where(
        and(
          eq(monthlyLeaves.userId, userId),
          eq(monthlyLeaves.month, month)
        )
      );

    return res.json({
      status: true,
      data: record || {
        month,
        appliedLeaves: 0,
        paidLeaves: 0,
        unpaidLeaves: 0
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
