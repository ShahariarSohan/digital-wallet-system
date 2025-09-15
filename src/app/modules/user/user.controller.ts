/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const user = await userServices.createUser(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User successfully created",
    data: user,
  });
};
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUser(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId=req.params.id
    const result = await userServices.getSingleUser(userId);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  }
);
const updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload
        const userId = req.params.id;
        const payload = req.body;
    const result = await userServices.updateUser(
     payload,userId,decodedToken
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
);

export const userControllers = {
  createUser,
    getAllUser,
    updateUser,
  getSingleUser
};
