
import httpStatus from "http-status-codes";

import AppError from "../../errorHelpers/appError";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "./wallet.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { Agent } from "../agent/agent.model";
import { ApprovalStatus } from "../agent/agent.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { walletSearchAbleFields } from "./wallet.constant";
import { IWallet, lockStatus } from "./wallet.interface";


const transactionPercentage = 0.01;
const commissionPercentage = 0.02;
const deposit = async (userId: string, amount: number) => {
  const transactionFee = amount * transactionPercentage;
  const depositAmount = amount - transactionFee;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();
    const isWalletExist = await Wallet.findOne({ user: userId });
    if (!isWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "No wallet found");
    }
    if (isWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is Locked");
    }
    await Wallet.updateOne(
      { user: userId },
      { $inc: { balance: depositAmount } },
      { new: true, runValidators: true, session }
    );
    const transaction = await Transaction.create(
      [
        {
          sender: userId,
          receiver: userId,
          amount: depositAmount,
          transactionFee,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
const withdraw = async (userId: string, amount: number) => {
  const transactionFee = amount * transactionPercentage;
  const withdrawAmount = amount + transactionFee;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();
    const isWalletExist = await Wallet.findOne({ user: userId });
    if (!isWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "No wallet found");
    }
    if (isWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is Locked");
    }
    if (isWalletExist.balance < withdrawAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    await Wallet.updateOne(
      { user: userId },
      { $inc: { balance: -withdrawAmount } },
      { new: true, runValidators: true, session }
    );
    const transaction = await Transaction.create(
      [
        {
          sender: userId,
          receiver: userId,
          amount: amount,
          transactionFee,
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    return transaction;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
const sendMoney = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  const transactionFee = amount * transactionPercentage;
  const totalAmount = amount + transactionFee;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();
    const isSenderWalletExist = await Wallet.findOne({ user: senderId });
    if (!isSenderWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    }
    if (isSenderWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Sender Wallet is Locked");
    }
    if (isSenderWalletExist.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    const isReceiverWalletExist = await Wallet.findOne({ user: receiverId });
    if (!isReceiverWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
    }
    if (isReceiverWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Receiver Wallet is Locked");
    }
    await Wallet.updateOne(
      { user: senderId },
      { $inc: { balance: -totalAmount } },
      { new: true, runValidators: true, session }
    );
    await Wallet.updateOne(
      { user: receiverId },
      { $inc: { balance: amount } },
      { new: true, runValidators: true, session }
    );
    const transaction = await Transaction.create(
      [
        {
          sender: senderId,
          receiver: receiverId,
          amount: amount,
          transactionFee,
          type: TransactionType.SEND_MONEY,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
const cashIn = async (agentId: string, userId: string, amount: number) => {
  const commission = amount * commissionPercentage;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();

    const isAgentExist = await Agent.findById(agentId);
    if (!isAgentExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent  not found");
    }
    if (
      isAgentExist.approvalStatus === ApprovalStatus.PENDING ||
      isAgentExist.approvalStatus === ApprovalStatus.SUSPENDED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Agent Approval is ${isAgentExist.approvalStatus}`
      );
    }

  
   
    const isAgentWalletExist = await Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent wallet not found");
    }
    if (isAgentWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Locked");
    }
    if (isAgentWalletExist.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    const isUserWalletExist = await Wallet.findOne({ user: userId });
    if (!isUserWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isUserWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Wallet is Locked");
    }
    await Wallet.updateOne(
      { user: agentId },
      { $inc: { balance: -amount } },
      { new: true, runValidators: true, session }
    );
    await Wallet.updateOne(
      { user: userId },
      { $inc: { balance: amount } },
      { new: true, runValidators: true, session }
    );
    const transaction = await Transaction.create(
      [
        {
          sender: agentId,
          receiver: userId,
          amount,
          commission,
          type: TransactionType.CASH_IN,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
const cashOut = async (agentId: string, userId: string, amount: number) => {
  const commission = amount * commissionPercentage;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();

    const isAgentExist = await Agent.findById(agentId);
    if (!isAgentExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent  not found");
    }
    if (
      isAgentExist.approvalStatus === ApprovalStatus.PENDING ||
      isAgentExist.approvalStatus === ApprovalStatus.SUSPENDED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Agent Approval is ${isAgentExist.approvalStatus}`
      );
    }
    const isAgentWalletExist = await Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent wallet not found");
    }
    if (isAgentWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Locked");
    }
    const isUserWalletExist = await Wallet.findOne({ user: userId });
    if (!isUserWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isUserWalletExist.lockStatus === lockStatus.LOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Wallet is Locked");
    }
    if (isUserWalletExist.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient User Balance");
    }

    await Wallet.updateOne(
      { user: userId },
      { $inc: { balance: -amount } },
      { new: true, runValidators: true, session }
    );
    await Wallet.updateOne(
      { user: agentId },
      { $inc: { balance: amount } },
      { new: true, runValidators: true, session }
    );
    const transaction = await Transaction.create(
      [
        {
          sender: agentId,
          receiver: userId,
          amount,
          commission,
          type: TransactionType.CASH_OUT,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
const getAllWallet = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Wallet.find(), query);
  const wallets = await queryBuilder
    .search(walletSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: wallets,
    meta: meta,
  };
};
const getMyWallet = async (id: string) => {
  const isWalletExist = await Wallet.findOne({ user: id });
  if (!isWalletExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No Wallet found");
  }
  return isWalletExist;
};
const updateLockStatus = async (
  payload: Partial<IWallet>,
  walletId: string
) => {
  const isWalletExist = await Wallet.findById(walletId);
  if (!isWalletExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No Wallet found");
  }

  const updatedWallet = await Wallet.findByIdAndUpdate(walletId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedWallet;
};
export const walletServices = {
  deposit,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
  getAllWallet,
  getMyWallet,
  updateLockStatus,
};
