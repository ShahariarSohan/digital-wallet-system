import { Types } from "mongoose";
import { IAuthProvider, Role } from "../../interfaces/interface";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  phone?: string;
  role?: Role.USER;
  auths: IAuthProvider[];
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
}
