import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { verifyToken } from "./verifyToken"
import { User } from "../modules/user/user.model"
import { Agent } from "../modules/agent/agent.model"
import AppError from "../errorHelpers/appError"
import { generateToken } from './generateToken';
import { Admin } from '../modules/admin/admin.model';


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken , envVars.JWT_REFRESH_SECRET ) as JwtPayload
    let isAccountExist = await User.findOne({ email: verifiedRefreshToken.email })
    
    if (!isAccountExist) {
        isAccountExist=await Agent.findOne({email:verifiedRefreshToken.email})
    }
    if (!isAccountExist) {
        isAccountExist=await Admin.findOne({email:verifiedRefreshToken.email})
    }

    if (!isAccountExist) {
        throw new AppError(httpStatus.NOT_FOUND,"Account is not found")
    }
    if (!isAccountExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is not verified")
    }
    if (!isAccountExist.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is not active")
    }
    if (isAccountExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST,"Account is deleted")
    }
    const jwtPayload = {
        id:isAccountExist._id,
        email: isAccountExist.email,
        role:isAccountExist.role,
    }
    const accessToken=generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    return {
        accessToken
    }   
}