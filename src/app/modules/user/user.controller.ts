/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { userServices } from "./user.service"
import sendResponse from "../../utils/sendResponse";

const createUser = async (req:Request,res:Response,next:NextFunction) => {
    const payload = req.body;
    const user = await userServices.createUser(payload)
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User successfully created",
        data: user,
    })
}


export const userControllers = {
    createUser
}