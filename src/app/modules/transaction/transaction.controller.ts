/* eslint-disable @typescript-eslint/no-unused-vars */
import { transactionRoutes } from './transaction.route';
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { transactionServices } from "./transaction.service";
import sendResponse from '../../utils/sendResponse';

const getAllTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await transactionServices.getAllTransaction(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Transactions retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const transactionControllers = {
    getAllTransaction
}
