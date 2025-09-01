/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionSearchAbleFields } from "./transaction.constants";
import { Transaction } from "./transaction.model";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";

const getAllTransaction = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);
  const transactions =await  queryBuilder
    .search(transactionSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: transactions,
    meta: meta,
  };
};
const getMyTransaction = async (
  id: string,
  query: Record<string, string>
) => {
  // Check if user exists
  const isUserExist = await User.findById(id);
  const matchTypes = isUserExist
    ? ["deposit", "withdraw", "send_money", "cash_in", "cash_out"]
    : ["cash_in", "cash_out"];

  // Build base filter
  const baseFilter: Record<string, any> = {
    $and: [
      { $or: [{ sender: id }, { receiver: id }] },
      { type: { $in: matchTypes } },
    ],
  };

  // Search
 const queryBuilder = new QueryBuilder(Transaction.find(baseFilter), query);
 const transactions = await queryBuilder
   .filter()
   .search(transactionSearchAbleFields)
   .sort()
   .fields()
   .paginate()
   .build();
 const meta = await queryBuilder.getMeta();
 return {
   data: transactions,
   meta: meta,
 };
};

const recentTransaction = async (id: string) => {
  const isUserExist = await User.findById(id);
   const matchTypes = isUserExist
     ? ["deposit", "withdraw", "send_money", "cash_in", "cash_out"]
     : ["cash_in", "cash_out"];
   
    const isTransactionsExist = await Transaction.find({
      $and: [
        { $or: [{ sender: id }, { receiver: id }] },
        { type: { $in: matchTypes } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);
    if (!isTransactionsExist) {
      throw new AppError(httpStatus.NOT_FOUND, "No transaction found");
    }
    return isTransactionsExist;
  
};
export const transactionServices = {
  getAllTransaction,
  getMyTransaction,
  recentTransaction,
};
