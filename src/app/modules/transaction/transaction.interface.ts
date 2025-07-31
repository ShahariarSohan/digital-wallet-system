export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  SEND_MONEY = "send_money",
  CASH_IN = "cash_in",
  CASH_OUT = "cash_out",
}
export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}
export enum TransactionMethod {
  WALLET = "wallet",
  BANK = "bank",
  CARD = "card",
}
export interface ITransaction {
  _id?: string;
  sender?: string;
  receiver?: string;
  type?: TransactionType;
  amount: number;
  method: TransactionMethod;
  status: TransactionStatus;
  transactionFee?: number;
}
