/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ILogin, Role } from "../../interfaces/interface";
import { Agent } from "../agent/agent.model";
import { User } from "../user/user.model";
import { bcryptComparePassword } from "../../utils/comparePassword";
import { createUserToken } from "../../utils/createToken";
import { setAuthCookie } from "../../utils/setCookie";
import { Response } from "express";
import { Admin } from "../admin/admin.model";
import { JwtPayload } from "jsonwebtoken";
import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { IUser, userStatus } from "../user/user.interface";
import { ApprovalStatus, IAgent } from "../agent/agent.interface";
import { generateToken } from "../../utils/generateToken";
import { sendEmail } from "../../utils/sendEmail";

const credentialsLogin = async (res: Response, payload: ILogin) => {
  let isAccountExist = await User.findOne({ email: payload.email });
  if (!isAccountExist) {
    isAccountExist = await Agent.findOne({ email: payload.email });
  }
  if (!isAccountExist) {
    isAccountExist = await Admin.findOne({ email: payload.email });
  }
  if (!isAccountExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Account doesn't exist");
  }
  if (!isAccountExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is not verified");
  }
  if (!isAccountExist.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is not active");
  }
  if (isAccountExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is deleted");
  }
  const googleAuthenticated = isAccountExist.auths.some(
    (providerObject) => providerObject.provider === "google"
  );
  if (googleAuthenticated && !isAccountExist.password) {
    return "You already logged in with google,so first you have to login with google then you can set password";
  }
  const isPasswordMatched = await bcryptComparePassword(
    payload.password,
    isAccountExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong Password");
  }
  const getToken:any = createUserToken(isAccountExist);
  setAuthCookie(res, getToken);
  const { password, ...rest } = isAccountExist.toObject();
  return {
    accessToken: getToken.accessToken,
    refreshToken: getToken.refreshToken,
    data: rest,
  };
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  let user = await User.findById(decodedToken.id);
  if (!user) {
    user = await Agent.findById(decodedToken.id);
  }
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user exist");
  }
  const isPasswordMatched = await bcryptComparePassword(
    oldPassword,
    user!.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't match");
  }
  user!.password = await bcryptHashPassword(
    newPassword,
    envVars.BCRYPT_SALT_ROUND
  );
  user!.save();
  return true;
};
const forgetPassword = async (res: Response, email: string) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await Agent.findOne({ email });
  }
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user exist");
  }
  if (!user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not Verified");
  }
  if (!user.isActive || user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted");
  }
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const resetToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    "10m"
  );
  res.cookie("accessToken", resetToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10* 60 * 1000,
  });
  const resetURILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}`;

  sendEmail({
    to: user.email,
    subject: "Reset password",
    templateName: "forgetPassword",
    templateData: {
      name: user.name,
      resetURILink,
    },
  });
};
const resetPassword = async (id: string, newPassword: string, decodedToken: JwtPayload) => {
  if (id !== decodedToken.id) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted to reset password")
  }
  let user = await User.findById(id)
  
  if (!user) {
    user=await Agent.findById(id)
  }
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user exist");
  }
  const hashPassword =await bcryptHashPassword(newPassword, envVars.BCRYPT_SALT_ROUND)
  
    user.password = hashPassword
    await user.save();
  
}
export const authServices = {
  credentialsLogin,
  changePassword,
  forgetPassword,
  resetPassword
};
