import { Types } from "mongoose";
import { IAuthProvider, Role } from "../../interfaces/interface";
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  SUSPENDED = "suspended",
}
export interface IAgent {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role.AGENT;
  auths: IAuthProvider[];
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  wallet?: Types.ObjectId;
  
}
