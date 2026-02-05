import { db } from "../../db/index.js";
import { sql } from "drizzle-orm";

export async function getEmployeeDailySummary(date) {
  const rows = await db.execute(sql`
    SELECT
      u.id AS userId,
      u.name AS userName,
      ${date} AS date,

      MIN(a.check_in) AS checkIn,
      MAX(a.check_out) AS checkOut,

      COALESCE(SUM(dr.hoursSpent), 0) AS totalEstimatedMinutes,

      COUNT(CASE WHEN dr.status = 'approved' THEN 1 END) AS approvedTasks,
      COUNT(CASE WHEN dr.status = 'submitted' THEN 1 END) AS pendingTasks,

      GROUP_CONCAT(dr.tasks SEPARATOR '||') AS tasks,

      CASE 
        WHEN l.id IS NOT NULL THEN 'On Leave'
        WHEN MIN(a.check_in) IS NOT NULL THEN 'Working'
        ELSE 'Absent'
      END AS dayStatus

    FROM users u

    LEFT JOIN attendance a
      ON a.user_id = u.id AND DATE(a.date) = ${date}

    LEFT JOIN daily_reports dr
      ON dr.user_id = u.id AND DATE(dr.date) = ${date}

    LEFT JOIN leave l
      ON l.user_id = u.id AND DATE(l.date) = ${date}

    WHERE u.role = 'employee'
    GROUP BY u.id
    ORDER BY u.name
  `);

  return rows.map(r => ({
    ...r,
    tasks: r.tasks ? r.tasks.split("||") : [],
  }));
}
