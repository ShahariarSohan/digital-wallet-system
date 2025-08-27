import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";

import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import { JwtPayload } from "jsonwebtoken";

const createAdmin = async (payload: IAdmin) => {
  const isAdminExist = await Admin.findOne({ email: payload.email });
  if (isAdminExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin Already Exist");
  }
  const { password } = payload;
  const hashPassword = await bcryptHashPassword(
    password as string,
    envVars.BCRYPT_SALT_ROUND
  );
  const payloadWithHashPassword = {
    ...payload,
    password: hashPassword,
  };
  const admin = await Admin.create(payloadWithHashPassword);
  return admin;
};
const getMe = async (adminId: string) => {
  const isAdminExist = await Admin.findById(adminId);
  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  return isAdminExist;
};
const updateAdminSettings = async (payload: Partial<IAdmin>, adminId: string, decodedToken: JwtPayload) => {
  
  if (adminId !== decodedToken.id ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
  const isAdminExist = await Admin.findById(adminId)
  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND,"No Admin found")
  }
 
  if (payload.password) {
    payload.password=await bcryptHashPassword(payload.password,envVars.BCRYPT_SALT_ROUND)
  }
  const newUpdatedAdminSettings=await Admin.findByIdAndUpdate(adminId,payload,{new:true,runValidators:true})
  return newUpdatedAdminSettings;
}
export const adminServices = {
  createAdmin,
  getMe,
  updateAdminSettings
};
