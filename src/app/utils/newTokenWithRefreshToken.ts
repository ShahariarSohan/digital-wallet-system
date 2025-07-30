import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { verifyToken } from "./verifyToken"
import { User } from "../modules/user/user.model"
import { Agent } from "../modules/agent/agent.model"
import AppError from "../errorHelpers/appError"
import { generateToken } from './generateToken';

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken , envVars.JWT_REFRESH_SECRET ) as JwtPayload
    let account = await User.findOne({ email: verifiedRefreshToken.email })
    
    if (!account) {
        account=await Agent.findOne({email:verifiedRefreshToken.email})
    }

    if (!account) {
        throw new AppError(httpStatus.NOT_FOUND,"Account is not found")
    }
    if (!account.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is not verified")
    }
    if (!account.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is not active")
    }
    if (account.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is deleted")
    }
    const jwtPayload = {
        id:account._id,
        email: account.email,
        role:account.role,
    }
    const accessToken=generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    return {
        accessToken
    }   
}