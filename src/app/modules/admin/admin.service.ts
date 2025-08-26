import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";

import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

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
export const adminServices = {
  createAdmin,
  getMe
};
