import { model, Schema } from "mongoose";
import { ITransaction, TransactionMethod, TransactionStatus, TransactionType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: Object.values(TransactionMethod),
      default: TransactionMethod.WALLET,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    transactionFee: { type: Number },
    commission: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction=model<ITransaction>("Transaction",transactionSchema)