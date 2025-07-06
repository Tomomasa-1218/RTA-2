import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial().extend({
  status: z.enum(["PENDING", "DONE"]).optional(),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>; 