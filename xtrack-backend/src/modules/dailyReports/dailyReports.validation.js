import { z } from "zod";

export const createDailyReportSchema = z.object({
  date: z.string(),
  tasks: z.string().optional(),
 hoursWorked: z.number().positive().multipleOf(0.01),

  hoursSpent: z.number().int().optional(),
  attachments: z.string().nullable().optional(),
  reportType: z.string().optional()
});

export const updateDailyReportSchema = createDailyReportSchema.partial();
