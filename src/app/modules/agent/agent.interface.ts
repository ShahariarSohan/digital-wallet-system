import { Types } from "mongoose";
import { IAuthProvider, Role, Status } from "../../interfaces/interface";

export interface IAgent {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  auths: IAuthProvider[];
  status?: Status;
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
  commission?: number;
}
