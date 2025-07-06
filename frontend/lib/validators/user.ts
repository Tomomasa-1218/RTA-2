import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6, "6文字以上で入力してください"),
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>; 