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
  const totalAmount = amount + transactionFee;
  const session = await Wallet.startSession();

  try {
    session.startTransaction();
    const isSenderWalletExist = await Wallet.findOne({ user: senderId });
    if (!isSenderWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "No wallet found");
    }
    if (isSenderWalletExist.isLocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Sender Wallet is Locked");
    }
    if (isSenderWalletExist.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }
    const isReceiverWalletExist = await Wallet.findOne({ user: receiverId });
    if (!isReceiverWalletExist) {
      throw new AppError(httpStatus.NOT_FOUND, "No wallet found");
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

export const walletServices = {
  deposit,
  withdraw,
  sendMoney,
};
