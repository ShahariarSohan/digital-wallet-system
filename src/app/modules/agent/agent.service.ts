import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Wallet } from "../wallet/wallet.model";
import { bcryptHashPassword } from "../../utils/hashPassword";
import { envVars } from "../../config/env";
import { IAgent } from "./agent.interface";
import { Agent } from "./agent.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { agentSearchAbleFields } from "./agent.constant";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../interfaces/interface";

const createAgent = async (payload: IAgent) => {
  const session = await Agent.startSession();

  try {
    session.startTransaction();
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
    return agentWithWalletId;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
const getAllAgent = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Agent.find(), query);
  const agents = await queryBuilder
    .search(agentSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: agents,
    meta: meta,
  };
};
const getMe = async (agentId: string) => {
  const isAgentExist = await Agent.findById(agentId);
  if (!isAgentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No agent found");
  }
  return isAgentExist;
};
const getSingleAgent = async (agentId: string) => {
  const isAgentExist = await Agent.findById(agentId);
  if (!isAgentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No agent found");
  }
  return isAgentExist;
};
const updateAgent = async (
  payload: Partial<IAgent>,
  agentId: string,
  decodedToken: JwtPayload
) => {
  if (agentId !== decodedToken.id && decodedToken.role === Role.AGENT) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }
  const isAgentExist = await Agent.findById(agentId);
  if (!isAgentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No agent found");
  }
  if (
    payload.phone ||
    payload.email||
    payload.role ||
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified ||
    payload.approvalStatus
  ) {
    if (decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcryptHashPassword(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const newUpdatedUser = await Agent.findByIdAndUpdate(agentId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};
export const agentServices = {
  createAgent,
  getAllAgent,
  updateAgent,
  getMe,
  getSingleAgent,
};
