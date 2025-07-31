
import { IAuthProvider, Role } from "../../interfaces/interface";

export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role.ADMIN;
  auths: IAuthProvider[];
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
}
