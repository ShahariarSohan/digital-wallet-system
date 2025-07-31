import { z } from "zod";

export const createWalletZodSchema = z.object({
  user: z.string(),
  balance: z.number().min(0).default(50),
  currency: z.string().min(3).default("BDT"),
});

export const updateWalletZodSchema = z.object({
  balance: z.number().min(0).optional(),
  currency: z.string().min(3).optional(),
  isLocked: z.boolean().optional(),
});

export const amountSchema = z.object({
  amount: z
    .number({
      error: "Amount must be a number",
    })
    .min(50, "Amount must be at least 50")
    .max(1_000_000, "Amount too large"),
});
export const sendMoneySchema = z.object({
  amount: z
    .number({
      error: "Amount must be a number",
    })
    .min(50, "Amount must be at least 50")
    .max(1_000_000, "Amount too large"),
  receiverId:z.string({error:"receiverId must be string"})
});

