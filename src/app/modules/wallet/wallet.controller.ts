/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { walletServices } from "./wallet.service";

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
    const receiverId = req.body.receiverId;
  const result = await walletServices.sendMoney(sender.id, receiverId,amount);
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
    const userId = req.body.userId;
  const result = await walletServices.cashIn(agent.id, userId,amount);
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
    const userId = req.body.userId;
  const result = await walletServices.cashOut(agent.id, userId,amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CashOut successfully ",
    data: result,
  });
};

export const walletControllers = {
  deposit,
  withdraw,
    sendMoney,
    cashIn,
    cashOut,

};
