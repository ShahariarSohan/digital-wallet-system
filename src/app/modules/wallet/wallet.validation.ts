import { z } from "zod";
import { lockStatus } from "./wallet.interface";

export const createWalletZodSchema = z.object({
  user: z.string(),
  balance: z.number().min(0).default(50),
  currency: z.string().min(3).default("BDT"),
   
});



export const amountSchema = z.object({
  amount: z
    .number({
      error: "Need amount and it must be a number",
    })
    .min(50, "Amount must be at least 50")
    .max(1_000_000, "Amount too large"),
});
export const sendMoneySchema = z.object({
  amount: z
    .number({
      error: "Need amount and it must be a number",
    })
    .min(50, "Amount must be at least 50")
    .max(1_000_000, "Amount too large"),
  receiverId:z.string({error:"Need receiverId  and it must be string"})
});
export const agentUserTransactionSchema = z.object({
  amount: z
    .number({
      error: "Need amount and it must be a number",
    })
    .min(50, "Amount must be at least 50")
    .max(1_000_000, "Amount too large"),
  userId:z.string({error:"Need userId  and it must be string"})
});

export const lockActivitySchema = z.object({
  
  lockStatus: z.enum(Object.values(lockStatus) as [string]).optional(),
});

