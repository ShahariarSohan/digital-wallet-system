/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';
import { adminServices } from './admin.service';

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminServices.createAdmin(req.body);
    
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin successfully created",
      data: result,
    });
  }
);
export const  adminControllers = {
    createAdmin
}