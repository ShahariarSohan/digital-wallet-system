import httpStatus from "http-status-codes";

import AppError from "../../errorHelpers/appError";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "./wallet.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";

const transactionFee = 10;
const deposit = async (userId: string, amount: number) => {
  const depositAmount = amount - transactionFee;
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
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
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const withdraw = async (userId: string, amount: number) => {
  const withdrawAmount=amount+transactionFee
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
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
      
      await isWalletExist.save();
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
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const walletServices = {
  deposit,
  withdraw,
};
