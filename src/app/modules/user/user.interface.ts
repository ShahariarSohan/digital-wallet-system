import { Types } from "mongoose";
import { IAuthProvider, Role } from "../../interfaces/interface";
export enum userStatus {
 
  BLOCK = "block",
  UNBLOCK="unblock"
}
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  phone?: string;
  role?: Role.USER;
  auths: IAuthProvider[];
  status?:userStatus;
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
}
