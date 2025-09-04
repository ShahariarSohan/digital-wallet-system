import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { Wallet } from "../wallet/wallet.model";
import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../interfaces/interface";
import { Agent } from "../agent/agent.model";

const createUser = async (payload: IUser) => {
  const session = await User.startSession();

  try {
    session.startTransaction();
    const isUserExist = await User.findOne({ email: payload.email });
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    }
     const isAgentExist = await Agent.findOne({ email: payload.email });
        if (isAgentExist) {
          throw new AppError(httpStatus.BAD_REQUEST, "Agent Already Exist");
        }
    const { password, ...rest } = payload;
    const hashPassword = await bcryptHashPassword(
      password as string,
      envVars.BCRYPT_SALT_ROUND
    );

    const user = await User.create([{ ...rest, password: hashPassword }], {
      session,
    });
    const wallet = await Wallet.create([{ user: user[0]._id }], { session });
    const userWithWalletId = await User.findByIdAndUpdate(
      user[0]._id,
      { wallet: wallet[0]._id },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    return userWithWalletId;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users =await queryBuilder
    .search(userSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: users,
    meta:meta
  }
};
const getMe = async (userId: string) => {
   const isUserExist = await User.findById(userId);
   if (!isUserExist) {
     throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  return isUserExist;
}
const getSingleUser = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  return isUserExist;
};
const updateUser = async (payload: Partial<IUser>, userId: string, decodedToken: JwtPayload) => {
  
  if ((userId !== decodedToken.id) && (decodedToken.role===Role.USER )) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
  const isUserExist = await User.findById(userId)
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND,"No user found")
  }
  if ( payload.role || payload.isActive || payload.isDeleted || payload.isVerified || payload.email) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
  }
  if (payload.password) {
    payload.password=await bcryptHashPassword(payload.password,envVars.BCRYPT_SALT_ROUND)
  }
  const newUpdatedUser=await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})
  return newUpdatedUser;
}
export const userServices = {
  createUser,
  getAllUser,
  updateUser,
  getMe,
  getSingleUser
};
