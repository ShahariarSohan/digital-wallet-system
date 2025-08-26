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
    ? ["deposit", "withdraw", "send_money"]
    : ["cash_in", "cash_out"];

  // Build base filter
  const baseFilter: Record<string, any> = {
    $and: [
      { $or: [{ sender: id }, { receiver: id }] },
      { type: { $in: matchTypes } },
    ],
  };

  // Search
  if (query.searchTerm) {
    baseFilter.$and.push({
      $or: matchTypes.map((field) => ({
        type: { $regex: query.searchTerm, $options: "i" }, // Example: search in type
      })),
    });
  }

  // Additional filters (excluding pagination/sort fields)
  const excludeFields = ["page", "limit", "sort", "fields", "searchTerm"];
  for (const key in query) {
    if (!excludeFields.includes(key)) {
      baseFilter[key] = query[key];
    }
  }

  // Count total documents
  const totalDocuments = await Transaction.countDocuments(baseFilter);
  if (!totalDocuments) {
    throw new AppError(httpStatus.NOT_FOUND, "No transaction found");
  }

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Sort
  const sortBy = query.sort || "-createdAt";

  // Fields selection
  const selectFields = query.fields ? query.fields.split(",").join(" ") : "";

  // Execute query
  const myTransactions = await Transaction.find(baseFilter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectFields);

  // Meta info
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    data: myTransactions,
    meta: {
      page,
      limit,
      total: totalDocuments,
      totalPages,
    },
  }
};

const recentTransaction = async (id: string) => {
  const isUserExist = await User.findById(id);
   const matchTypes = isUserExist
     ? ["deposit", "withdraw", "send_money"]
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
