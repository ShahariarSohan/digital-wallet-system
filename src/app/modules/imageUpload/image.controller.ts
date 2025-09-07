/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { imageServices } from './image.service';
import { JwtPayload } from 'jsonwebtoken';


const imageUpload = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
   const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const picture = req.file?.path as string;
  
 await imageServices.imageUpload(id,picture,decodedToken)

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: " Image uploaded successfully",
      data: null,
    });
  }
);

export const imageControllers = {
    imageUpload
}