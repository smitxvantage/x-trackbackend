import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { salary } from "../../db/schema/salarySchema.js";
import { eq } from "drizzle-orm";

export async function createEmployeeController(req, res) {
  try {
    const { name, salary: empSalary } = req.body;

    if (!name || !empSalary) {
      return res.status(400).json({ error: "Name and salary are required" });
    }

    // Step 1: find user by name
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, name))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user[0].id;

    // Step 2: insert salary record
    const inserted = await db
      .insert(salary)
      .values({
        userId,
        name,
        salary: Number(empSalary),
      });

    // Step 3: fetch inserted row
    const [record] = await db
      .select()
      .from(salary)
      .where(eq(salary.id, inserted.insertId));

    return res.status(200).json({
      message: "Employee salary record created",
      ...record,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getEmployeesController(req, res) {
  try {
    const result = await db.select().from(salary);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
