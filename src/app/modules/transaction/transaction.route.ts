import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";
import { transactionControllers } from "./transaction.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN),
  transactionControllers.getAllTransaction
);
router.get(
  "/me",
  checkAuth(Role.AGENT, Role.USER),
  transactionControllers.getMyTransaction
);
router.get(
  "/recent",
  checkAuth(Role.AGENT, Role.USER),
  transactionControllers.recentTransactions
);
export const transactionRoutes = router;
