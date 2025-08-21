/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { ILogin } from "../../interfaces/interface";
import { Agent } from "../agent/agent.model";
import { User } from "../user/user.model";
import { bcryptComparePassword } from '../../utils/comparePassword';
import { createUserToken } from '../../utils/createToken';
import { setAuthCookie } from '../../utils/setCookie';
import { Response } from 'express';
import { Admin } from '../admin/admin.model';


const credentialsLogin = async (res:Response ,payload:ILogin) => {
    let isAccountExist = await User.findOne({ email: payload.email })
    if (!isAccountExist) {
        isAccountExist=await Agent.findOne({email:payload.email})
    }
    if (!isAccountExist) {
        isAccountExist=await Admin.findOne({email:payload.email})
    }
    if (!isAccountExist) {
        throw new AppError(httpStatus.NOT_FOUND,"Account doesn't exist")
    }
    if (!isAccountExist.isVerified) {
         throw new AppError(httpStatus.BAD_REQUEST, "Account is not verified");
    }
    if (!isAccountExist.isActive) {
         throw new AppError(httpStatus.BAD_REQUEST, "Account is not active");
    }
    if (isAccountExist.isDeleted) {
         throw new AppError(httpStatus.BAD_REQUEST, "Account is deleted");
    }
    const googleAuthenticated=isAccountExist.auths.some((providerObject)=>providerObject.provider==="google")
    if (googleAuthenticated && !isAccountExist.password) {
        return "You already logged in with google,so first you have to login with google then you can set password"
    }
    const isPasswordMatched =await bcryptComparePassword(payload.password, isAccountExist.password as string)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.NOT_FOUND,"Wrong Password")
    }
    const getToken = createUserToken(isAccountExist)
    setAuthCookie(res,getToken)
    const { password, ...rest } = isAccountExist.toObject();
    return {
        accessToken:getToken.accessToken,
        refreshToken: getToken.refreshToken,
        data:rest
    }

}

export const authServices = {
    credentialsLogin,
    
}