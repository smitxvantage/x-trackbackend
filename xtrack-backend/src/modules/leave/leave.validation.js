import { z } from "zod";

export const createLeaveSchema = z.object({
  leaveType: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number().min(0.5),
  reason: z.string().min(1),
  dayType: z.string().optional(),
  startTime: z.string(),
  endTime: z.string()
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional()
});
