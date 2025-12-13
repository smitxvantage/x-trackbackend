import { salary as salaryTable } from "../../db/schema/salarySchema.js";
import { holidays as holidaysTable } from "../../db/schema/holidays.js";
import { monthlyLeaves } from "../../db/schema/monthlyLeaves.js";
import { db } from "../../db/index.js";
import dayjs from "dayjs";

function isHoliday(date, holidayList) {
  return holidayList.some((h) => dayjs(h.date).isSame(date, "day"));
}

export async function calculateSalaryController(req, res) {
  try {
    const { year, month } = req.query;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-based month

    let y, m;

    if (year && month) {
      y = Number(year);
      m = Number(month);

      // Prevent accessing current or future month
      if (y > currentYear || (y === currentYear && m >= currentMonth)) {
        return res.status(400).json({
          error: "Cannot view salary for current or future month",
        });
      }
    } else {
      // Default to previous month
      m = now.getMonth(); // previous month (0 = Jan)
      if (m === 0) {
        m = 12;
        y = currentYear - 1;
      } else {
        y = currentYear;
      }
    }

    const employees = await db.select().from(salaryTable);

    const allHolidays = await db.select().from(holidaysTable);
    const holidayList = allHolidays.filter((h) => Number(h.is_optional) === 0);
    const allLeaves = await db.select().from(monthlyLeaves);

    const daysInMonth = dayjs(`${y}-${m}-01`).daysInMonth();

    let sundays = 0;
    let totalSaturdays = 0;
    let saturdaysAsDates = [];
    let workingDays = 0;
    let holidaysCount = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = dayjs(`${y}-${m}-${d}`);
      const weekday = date.day(); // 0 = Sun, 6 = Sat

      if (weekday === 0) {
        sundays++;
        continue;
      }
      if (weekday === 6) {
        totalSaturdays++;
        saturdaysAsDates.push(date);
        continue;
      }
      if (isHoliday(date, holidayList)) {
        holidaysCount++;
        continue;
      }

      workingDays++;
    }

    if (saturdaysAsDates.length > 0) saturdaysAsDates.shift();
    workingDays += saturdaysAsDates.length;
    if (workingDays < 0) workingDays = 0;

    const monthStr = m.toString().padStart(2, "0");
    const leaveKey = `${y}-${monthStr}`;

    const result = employees.map((emp) => {
      const perDay = workingDays > 0 ? emp.salary / workingDays : 0;
     const userLeaves = allLeaves.filter(
        (l) => l.userId === emp.userId && l.month === leaveKey
      );

      const getLeaves = userLeaves.reduce(
        (sum, l) => sum + Number(l.paidLeaves),
        0
      );

      const paidLeaveSalary = getLeaves * perDay;

      return {
        id: emp.id,
        name: emp.name,
        userId: emp.userId,
        salary: emp.salary,
        getLeaves,
        paidLeaveSalary: Math.round(paidLeaveSalary),
        year: y,
        month: m,
        summary: {
          totalDays: daysInMonth,
          sundays,
          saturdaysTotal: totalSaturdays,
          holidays: holidaysCount,
          workingDays,
        },
        perDay: Math.round(perDay),
        finalSalary: Math.round(emp.salary - paidLeaveSalary),
      };
    });

    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
