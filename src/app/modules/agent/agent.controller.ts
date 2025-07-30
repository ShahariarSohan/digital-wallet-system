/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import sendResponse from "../../utils/sendResponse";
import { agentServices } from "./agent.service";

const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const agent = await agentServices.createAgent(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User successfully created",
    data: agent,
  });
};

export const agentControllers = {
  createAgent,
};
