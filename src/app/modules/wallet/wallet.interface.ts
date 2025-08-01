import { Types } from "mongoose";
export enum lockStatus{
  LOCKED = "locked",
  UNLOCKED="unlocked"  
    
}
export interface IWallet {
  _id?: string;
  user: Types.ObjectId;
  balance: number;
  currency: string;
  lockStatus?: lockStatus;
  
}
