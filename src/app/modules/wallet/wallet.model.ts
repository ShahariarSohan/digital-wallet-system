import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
  user: {
    type:Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: { type: Number, default: 50 },
  currency: { type: String, default: "BDT" }, 
  isLocked: { type: Boolean, default: false },
});

export const Wallet=model<IWallet>("Wallet",walletSchema)