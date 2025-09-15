/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { createUserToken } from "../../utils/createToken";
import { setAuthCookie } from "../../utils/setCookie";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authServices.credentialsLogin(res, req.body);
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Successfully Logged In",
      data: result,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Successfully Logged Out",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const oldPassword = req.body.currentPassword;
    const newPassword = req.body.password;
    await authServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email}=req.body
    const result = await authServices.forgetPassword(res,email);
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Sent forget-password email",
      data: result,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const {id,newPassword}=req.body
    const result = await authServices.resetPassword(id,newPassword, decodedToken as JwtPayload);
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Reset password successfully",
      data: result,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await authServices.getMe(decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "My data retrieved successfully",
      data: result,
    });
  }
);
export const authControllers = {
  credentialsLogin,
  googleCallbackController,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
  getMe
};
