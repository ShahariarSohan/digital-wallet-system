import { model, Schema } from "mongoose";
import { IWallet, lockStatus } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: { type: Number, default: 50 },
    currency: { type: String, default: "BDT" },
    lockStatus: {
          type: String,
          enum: Object.values(lockStatus),
          default: lockStatus.UNLOCKED,
        },
    
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
