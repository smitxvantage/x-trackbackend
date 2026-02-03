import { db } from "../src/db/index.js";
import { dailyReports } from "../src/db/schema/dailyReports.js";
import { eq } from "drizzle-orm";

function parseTimeToMinutes(text) {
  if (!text) return 0;

  let minutes = 0;

  const h = text.match(/(\d+)\s*h/);
  const m = text.match(/(\d+)\s*m/);

  if (h) minutes += Number(h[1]) * 60;
  if (m) minutes += Number(m[1]);

  return minutes;
}

async function migrate() {
  const reports = await db.select().from(dailyReports);

  for (const report of reports) {
    // skip already migrated
    if (report.hoursSpent > 0) continue;
    if (!report.tasks) continue;

    const lines = report.tasks.split("\n");

    const taskLine = lines.find(l => l.startsWith("Task:"));
    const timeLine = lines.find(l => l.includes("Estimated Time:"));
    const adminLine = lines.find(l => l.startsWith("Admin:"));

    const cleanTask = taskLine
      ? taskLine.replace("Task:", "").trim()
      : report.tasks;

    const minutes = parseTimeToMinutes(timeLine || "");

    const admin = adminLine
      ? adminLine.replace("Admin:", "").trim()
      : null;

    await db
      .update(dailyReports)
      .set({
        tasks: cleanTask,
        hoursSpent: minutes,
        admin: admin,
      })
      .where(eq(dailyReports.id, report.id));
  }

  console.log("✅ Daily reports migration completed");
  process.exit(0);
}

migrate();
