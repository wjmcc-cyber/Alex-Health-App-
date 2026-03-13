import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password should be at least 6 characters.")
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Please enter your name.")
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
