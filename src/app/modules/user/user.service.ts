import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { Wallet } from "../wallet/wallet.model";
import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";

const createUser = async (payload: IUser) => {
  const session = await User.startSession();

  try {
    session.startTransaction();
    const isUserExist = await User.findOne({ email: payload.email });
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    }
    const { password, ...rest } = payload;
    const hashPassword = await bcryptHashPassword(
      password,
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

export const userServices = {
  createUser,
};
