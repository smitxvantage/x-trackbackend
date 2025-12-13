import dayjs from "dayjs";

// Deduct all Sundays and 1 Saturday
export function getWorkingDays(year, month) {
  const totalDays = dayjs(`${year}-${month}-01`).daysInMonth();
  let sundays = 0;
  let saturdays = [];

  for (let d = 1; d <= totalDays; d++) {
    const date = dayjs(`${year}-${month}-${d}`);
    const day = date.day();

    if (day === 0) sundays++;
    if (day === 6) saturdays.push(date);
  }

  // Deduct 1 Saturday
  const paidSaturdays = Math.max(0, saturdays.length - 1);

  // Working weekdays (Mon–Fri)
  const weekdays = totalDays - sundays - saturdays.length;

  return weekdays + paidSaturdays;
}
