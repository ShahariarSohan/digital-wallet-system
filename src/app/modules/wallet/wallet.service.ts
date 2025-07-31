
import httpStatus from "http-status-codes";

import AppError from "../../errorHelpers/appError";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "./wallet.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";

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
    if (isWalletExist.isLocked) {
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
    if (isWalletExist.isLocked) {
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
    const transactionFee=amount*transactionPercentage
  const totalAmount = amount + transactionFee;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();
    const isSenderWalletExist = await Wallet.findOne({ user: senderId });
    if (!isSenderWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    }
    if (isSenderWalletExist.isLocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Sender Wallet is Locked");
    }
    if (isSenderWalletExist.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    const isReceiverWalletExist = await Wallet.findOne({ user: receiverId });
    if (!isReceiverWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
    }
    if (isReceiverWalletExist.isLocked) {
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
    const isAgentWalletExist = await Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent wallet not found");
    }
    if (isAgentWalletExist.isLocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Locked");
    }
    if (isAgentWalletExist.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    const isUserWalletExist = await Wallet.findOne({ user: userId });
    if (!isUserWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isUserWalletExist.isLocked) {
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
    const isAgentWalletExist = await Wallet.findOne({ user: agentId });
    if (!isAgentWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, " Agent wallet not found");
    }
    if (isAgentWalletExist.isLocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Locked");
      }
      const isUserWalletExist = await Wallet.findOne({ user: userId });
       if (!isUserWalletExist) {
         throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
       }
       if (isUserWalletExist.isLocked) {
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

export const walletServices = {
  deposit,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
};
