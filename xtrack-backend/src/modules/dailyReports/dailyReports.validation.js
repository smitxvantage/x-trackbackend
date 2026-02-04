import { z } from "zod";

export const createDailyReportSchema = z.object({
  date: z.string(),
  tasks: z.string().optional(),
  hoursWorked: z.number().multipleOf(0.01),
  hoursSpent: z.number().int().optional(),
  attachments: z.string().nullable().optional(),
  reportType: z.string().optional(),
  admin: z.string().optional(),
});

export const updateDailyReportSchema = z.object({
  tasks: z.string().min(1),
  hoursSpent: z.number().int(),
  admin: z.string().optional(),
});

export const approveReportSchema = z.object({
  admin: z.string().min(1),
});

