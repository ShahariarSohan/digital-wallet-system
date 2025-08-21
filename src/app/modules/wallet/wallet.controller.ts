/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { walletServices } from "./wallet.service";
import catchAsync from "../../utils/catchAsync";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";

const deposit = async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const amount = req.body.amount;

  const result = await walletServices.deposit(decodedToken.id, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Deposited Amount successfully ",
    data: result,
  });
};
const withdraw = async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const amount = req.body.amount;
  const result = await walletServices.withdraw(decodedToken.id, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdraw Amount successfully ",
    data: result,
  });
};
const sendMoney = async (req: Request, res: Response, next: NextFunction) => {
  const sender = req.user as JwtPayload;
  const amount = req.body.amount;
  const receiverEmail = req.body.receiverEmail;
  const isUserExist = await User.findOne({ email: receiverEmail })
  if (!isUserExist) {
     throw new AppError(
       httpStatus.NOT_FOUND ,
       "No Email exist"
     );
  }
  const receiverId=isUserExist._id
  const result = await walletServices.sendMoney(sender.id, receiverId, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Send Money successfully ",
    data: result,
  });
};
const cashIn = async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.user as JwtPayload;
  const amount = req.body.amount;
   const userEmail = req.body.userEmail;
   const isUserExist = await User.findOne({ email: userEmail });
   if (!isUserExist) {
     throw new AppError(httpStatus.NOT_FOUND, "No Email exist");
   }
   const userId = isUserExist._id;
  const result = await walletServices.cashIn(agent.id, userId, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CashIn successfully ",
    data: result,
  });
};
const cashOut = async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.user as JwtPayload;
  const amount = req.body.amount;
   const userEmail = req.body.userEmail;
   const isUserExist = await User.findOne({ email: userEmail });
   if (!isUserExist) {
     throw new AppError(httpStatus.NOT_FOUND, "No Email exist");
   }
   const userId = isUserExist._id;
 
  const result = await walletServices.cashOut(agent.id, userId, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CashOut successfully ",
    data: result,
  });
};
const getAllWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await walletServices.getAllWallet(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Wallets retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getMyWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await walletServices.getMyWallet(decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Wallet retrieved successfully",
      data: result,
    });
  }
);
const updateLockStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const walletId = req.params.id;
    const result = await walletServices.updateLockStatus(payload,walletId);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Wallet status updated successfully",
      data: result,
    });
  }
);
export const walletControllers = {
  deposit,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
  getAllWallet,
  getMyWallet,
  updateLockStatus
};
