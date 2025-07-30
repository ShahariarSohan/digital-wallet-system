import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Wallet } from "../wallet/wallet.model";
import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { IAgent } from "./agent.interface";
import { Agent } from "./agent.model";

const createAgent = async (payload: IAgent
) => {
  const session = await Agent.startSession();
  session.startTransaction();
  try {
    const isAgentExist = await Agent.findOne({ email: payload.email });
    if (isAgentExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Already Exist");
    }
    const { password, ...rest } = payload;
    const hashPassword = await bcryptHashPassword(
      password,
      envVars.BCRYPT_SALT_ROUND
    );

    const agent = await Agent.create([{ ...rest, password: hashPassword }], {
      session,
    });

    const wallet = await Wallet.create([{ user: agent[0]._id }], { session });

    const agentWithWalletId = await Agent.findByIdAndUpdate(
      agent[0]._id,
      { wallet: wallet[0]._id },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return agentWithWalletId;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const agentServices = {
  createAgent,
};
