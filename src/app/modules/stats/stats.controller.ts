/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statsServices } from "./stats.service";
import { JwtPayload } from "jsonwebtoken";


const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getUserStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "User stats Retrieved Successfully",
      data: result,
    });
  }
);
const getAgentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getAgentStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Agent stats Retrieved Successfully",
      data: result,
    });
  }
);
const getWalletStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getWalletStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Wallet stats Retrieved Successfully",
      data: result,
    });
  }
);
const getTransactionStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getTransactionStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Transaction stats Retrieved Successfully",
      data: result,
    });
  }
);
const getMyTransactionStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken=req.user as JwtPayload
    const result = await statsServices.getMYTransactionStats(decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "My Transaction stats Retrieved Successfully",
      data: result,
    });
  }
);
export const statsControllers = {
  getUserStats,
  getAgentStats,
  getWalletStats,
  getTransactionStats,
  getMyTransactionStats
};
