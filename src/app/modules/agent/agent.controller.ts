import { agentServices } from './agent.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const agent = await agentServices.createAgent(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Agent successfully created",
    data: agent,
  });
};

const getAllAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await agentServices.getAllAgent(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Agents retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await agentServices.getMe(decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Agent retrieved successfully",
      data: result,
    });
  }
);
const getSingleAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.params.id;
    const result = await agentServices.getSingleAgent(agentId);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Agent retrieved successfully",
      data: result,
    });
  }
);
const updateAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const agentId = req.params.id;
    const payload = req.body;
    const result = await agentServices.updateAgent(payload, agentId, decodedToken);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Agent updated successfully",
      data: result,
    });
  }
);
export const agentControllers = {
  createAgent,
  getAllAgent,
  getMe,
  getSingleAgent,
  updateAgent
};
