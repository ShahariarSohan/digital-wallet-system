import  httpStatus  from 'http-status-codes';
import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionSearchAbleFields } from "./transaction.constants";
import { Transaction } from "./transaction.model";
import AppError from '../../errorHelpers/appError';

const getAllTransaction = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);
  const transactions = await queryBuilder
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
const getMyTransaction = async (id: string) => {
  
  const isTransactionsExist = await Transaction.find({$or:[{sender:id},{receiver:id}]});
  if (!isTransactionsExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No transaction found");
  }
  return isTransactionsExist;
};
export const transactionServices = {
  getAllTransaction,
  getMyTransaction
}