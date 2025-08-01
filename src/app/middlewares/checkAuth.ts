import  httpStatus  from 'http-status-codes';
import { NextFunction, Request,Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/verifyToken";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { Agent } from "../modules/agent/agent.model";
import { Admin } from "../modules/admin/admin.model";

export const checkAuth = (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403,"No tokens received")
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        
        let isAccountExist = await User.findOne({ email: verifiedToken.email })
        if (!isAccountExist) {
            isAccountExist=await Agent.findOne({email:verifiedToken.email})
        }
        if (!isAccountExist) {
            isAccountExist=await Admin.findOne({email:verifiedToken.email})
        }
         if (!isAccountExist) {
           throw new AppError(httpStatus.NOT_FOUND, "Account is not found");
         }
         if (!isAccountExist.isVerified) {
           throw new AppError(
             httpStatus.BAD_REQUEST,
             "Account is not verified"
           );
         }
         if (!isAccountExist.isActive) {
           throw new AppError(httpStatus.BAD_REQUEST, "Account is not active");
         }
         if (isAccountExist.isDeleted) {
           throw new AppError(httpStatus.BAD_REQUEST, "Account is deleted");
        }
        if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.BAD_REQUEST,"You are not permitted");
        }
      req.user = verifiedToken;
      next();
    } catch (error) {
        next(error)
    }
}