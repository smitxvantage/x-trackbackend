import { z } from "zod";

export const createHolidaySchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  isOptional: z.boolean().optional()
});

export const updateHolidaySchema = createHolidaySchema.partial();
