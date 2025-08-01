import { z } from "zod";
import { ApprovalStatus } from "./agent.interface";


export const createAgentZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(5, { message: "Name must be  at least 5 characters" })
    .max(50, { message: "Name must be maximum of 50 characters" }),
  email: z
    .email({ message: "Email is invalid" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be maximum of 100 characters" }),
  password: z
    .string({ error: " Password must be string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/.*[A-Z].*/, {
      message: `Password must be at least 1 uppercase letter`,
    })
    .regex(/.*\d.*/, { message: `Password must be at least 1 number` })
    .regex(/[!@#$%^&*?]/, {
      message: `Password must be at least 1 special character`,
    }),
  phone: z
    .string({ error: "Phone  required and it must be string and unique" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message:
        "Phone must be valid for Bangladesh.Format : +8801XXXXXXX or 01XXXXXXXX",
    }),

  wallet: z.string().optional(),
 
});

export const updateAgentZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(5, { message: "Name must be  at least 5 characters" })
    .max(50, { message: "Name must be maximum of 50 characters" })
    .optional(),
  password: z
    .string({ error: " Password must be string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/.*[A-Z].*/, {
      message: `Password must be at least 1 uppercase letter`,
    })
    .regex(/.*\d.*/, { message: `Password must be at least 1 number` })
    .regex(/[!@#$%^&*?]/, {
      message: `Password must be at least 1 special character`,
    })
    .optional(),
  approvalStatus: z.enum(Object.values(ApprovalStatus) as [string]).optional(),
  isActive: z.boolean({ error: "isActive must be true or false" }).optional(),
  isDeleted: z.boolean({ error: "isDeleted must be true or false" }).optional(),
  isVerified: z
    .boolean({ error: "isVerified must be true or false" })
    .optional(),
});
