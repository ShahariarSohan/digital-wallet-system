/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { otpServices } from "./otp.service";

const sendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    await otpServices.sendOtp(email, name);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: " OTP send successfully",
      data: null,
    });
  }
);
const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    await otpServices.verifyOtp(email, otp);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "OTP Verified successfully",
      data: null,
    });
  }
);
export const otpControllers = {
  sendOtp,
  verifyOtp,
};
