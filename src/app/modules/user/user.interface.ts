import { Types } from "mongoose";
import { Role } from "../../interfaces/interface";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
}
