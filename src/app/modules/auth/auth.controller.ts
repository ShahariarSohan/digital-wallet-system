import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from '../../utils/sendResponse';

const credentialsLogin = catchAsync((req: Request, res: Response, next: NextFunction) => {
    

      sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "User successfully created",
        data: {},
      });
})

export const authControllers = {
    credentialsLogin
}