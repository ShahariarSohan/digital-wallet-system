/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
  const result=await authServices.credentialsLogin(res,req.body)
      sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "Successfully Logged In",
        data: result,
      });
})
const logout = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite:'lax'
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite:'lax'
  })
      sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "Successfully Logged Out",
        data: null,
      });
})

export const authControllers = {
  credentialsLogin,
  logout
}