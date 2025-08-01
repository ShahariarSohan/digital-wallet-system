import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionSearchAbleFields } from "./transaction.constants";
import { Transaction } from "./transaction.model";

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

export const transactionServices = {
    getAllTransaction
}