import mongoose from "mongoose";
import { Agent } from "../agent/agent.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const getUserStats = async () => {
  const totalUsers =await User.countDocuments();

  return { totalUsers };
};
const getAgentStats = async () => {
  const totalAgents =await Agent.countDocuments();
  
  return { totalAgents };
};
const getWalletStats = async () => {
  const totalWallets = await Wallet.countDocuments();
 
  return { totalWallets };
};
const getTransactionStats = async () => {
  const totalTransactionsPromise = Transaction.countDocuments();
  const totalTransactionAmountPromise = Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const allOperationsPromise = Transaction.aggregate([
    {
      $group: {
        _id: "$type",
        totalCounts: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const [totalTransactions, totalTransactionAmount, allOperations] =
    await Promise.all([
      totalTransactionsPromise,
      totalTransactionAmountPromise,
      allOperationsPromise,
    ]);

  return {
    totalTransactions,
    allOperations,
    totalTransactionAmount: totalTransactionAmount[0].totalAmount,
  };
};

const getMYTransactionStats = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const isUserExist = await User.findById(objectId);

  const matchTypes = isUserExist
    ? ["deposit", "withdraw", "send_money"]
    : ["cash_in", "cash_out"];

  const myTransactions = await Transaction.aggregate([
    {
      $match: {
        $and: [
          { $or: [{ sender: objectId }, { receiver: objectId }] },
          { type: { $in: matchTypes } },
        ],
      },
    },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalCounts: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
        perTypes: [
          {
            $group: {
              _id: "$type",
              totalCounts: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  return { myTransactions: myTransactions[0] || { overall: [], perTypes: [] } };
};

export const statsServices = {
  getUserStats,
  getAgentStats,
  getWalletStats,
  getTransactionStats,
  getMYTransactionStats,
};
