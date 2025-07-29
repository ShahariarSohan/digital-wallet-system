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
