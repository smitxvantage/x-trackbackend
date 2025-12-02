import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["admin", "employee"]).optional(),
  department: z.string().optional(),
  managerId: z.number().int().optional(),
  joiningDate: z.string().optional()
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(6).optional()
});
