/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import sendResponse from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';
import { walletServices } from './wallet.service';

const deposit = async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    let amount = req.body;
    amount = amount.amount;
  
    console.log("from controllers",decodedToken.id,amount)
    const result=await walletServices.deposit(decodedToken.id,amount)
    sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Deposited Amount successfully ",
          data: result,
        });
}
const withdraw = async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const amount = req.body.amount;
    const result=await walletServices.withdraw(decodedToken.id,amount)
    sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Withdraw Amount successfully ",
          data: result,
        });
}


export const walletControllers = {
    deposit,
    withdraw
}