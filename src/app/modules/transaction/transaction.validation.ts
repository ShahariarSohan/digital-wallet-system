import z from "zod";
import { TransactionMethod, TransactionStatus, TransactionType } from "./transaction.interface";

export const createTransactionSchema = z.object({
  sender: z.string().optional(),
  receiver: z.string().optional(),
  type: z.enum(Object.values(TransactionType) as [string]),
  amount: z.number().positive("Amount must be a positive number"),
  method: z
    .enum(Object.values(TransactionMethod) as [string])
  .optional(),
  status: z
    .enum(Object.values(TransactionStatus) as [string])
    .default(TransactionStatus.PENDING),
});
