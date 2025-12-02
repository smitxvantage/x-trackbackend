import { z } from "zod";

export const createLeaveSchema = z.object({
  leaveType: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number().int().min(1),
  reason: z.string().min(1)
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional()
});
