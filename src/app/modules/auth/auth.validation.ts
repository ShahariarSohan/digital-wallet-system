import z from "zod";

export const forgetPasswordZodSchema = z.object({
  email: z
    .email({ message: "Email is invalid" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be maximum of 100 characters" }),
});
export const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z
    .string({ error: " Password must be string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/.*[A-Z].*/, {
      message: `Password must be at least 1 uppercase letter`,
    })
    .regex(/.*\d.*/, { message: `Password must be at least 1 number` })
    .regex(/[!@#$%^&*?]/, {
      message: `Password must be at least 1 special character`,
    }),
});
