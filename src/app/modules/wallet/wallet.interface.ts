import { Types } from "mongoose";

export interface IWallet {
  _id?: string;
  user: Types.ObjectId;
  balance: number;
  currency: string;
  isLocked?: boolean;
  
}
