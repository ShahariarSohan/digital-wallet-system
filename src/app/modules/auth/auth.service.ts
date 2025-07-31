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
    const isPasswordMatched =await bcryptComparePassword(payload.password, isAccountExist.password)
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