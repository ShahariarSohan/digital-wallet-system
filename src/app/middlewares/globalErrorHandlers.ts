/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { IErrorSources } from "../interfaces/errorTypes";
import { handleCastError } from "../errorHelpers/hadleCastError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import AppError from "../errorHelpers/appError";

export const globalErrorHandlers = async (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Something Went Wrong";
    let errorSources:IErrorSources[]=[]
    if (envVars.NODE_ENV === "development") {
        console.log(err)
    }
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode=simplifiedError.statusCode
        message=simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources=simplifiedError.errorSources as IErrorSources[]
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources=simplifiedError.errorSources as IErrorSources[]
    }
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        
    }
    else if (err instanceof AppError) {
       statusCode = err.statusCode;
       message = err.message;
        
    }
    else if (err instanceof Error) {
       statusCode =500;
       message = err.message;
        
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err:envVars.NODE_ENV==='development'?err:null,
        stack:envVars.NODE_ENV==='development'?err.stack:null,
    })
}