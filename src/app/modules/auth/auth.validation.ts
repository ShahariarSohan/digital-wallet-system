import z from "zod";

export const forgetPasswordZodSchema = z.object({
  email: z
    .email({ message: "Email is invalid" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be maximum of 100 characters" }),
});
export const resetPasswordZodSchema = z.object({
  id: z.string(),
  email: z
    .email({ message: "Email is invalid" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be maximum of 100 characters" }),
});
