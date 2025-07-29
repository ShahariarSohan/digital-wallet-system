/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const globalErrorHandlers = async (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Something Went Wrong";
    if (envVars.NODE_ENV === "development") {
        console.log(err)
    }
    res.status(statusCode).json({
        success: false,
        message,
        err:envVars.NODE_ENV==='development'?err:null,
        stack:envVars.NODE_ENV==='development'?err.stack:null,
    })
}