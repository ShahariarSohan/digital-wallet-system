
import { validateRequest } from './../../middlewares/validateRequest';
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";
import { walletControllers } from "./wallet.controller";
import { agentUserTransactionSchema, amountSchema, lockActivitySchema, sendMoneySchema } from './wallet.validation';


const router = Router()

router.post("/deposit",checkAuth(Role.USER),validateRequest(amountSchema),walletControllers.deposit)
router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(amountSchema),
  walletControllers.withdraw
);
router.post(
  "/sendMoney",
  checkAuth(Role.USER),
  validateRequest(sendMoneySchema),
  walletControllers.sendMoney
);
router.post(
  "/cashIn",
  checkAuth(Role.AGENT),
  validateRequest(agentUserTransactionSchema),
  walletControllers.cashIn
);
router.post(
  "/cashOut",
  checkAuth(Role.AGENT),
  validateRequest(agentUserTransactionSchema),
  walletControllers.cashOut
);
router.get("/",checkAuth(Role.ADMIN),walletControllers.getAllWallet)
router.get("/myWallet", checkAuth(...Object.values(Role)), walletControllers.getMyWallet)
router.patch("/lockStatus/:id",checkAuth(Role.ADMIN),validateRequest(lockActivitySchema),walletControllers.updateLockStatus)
export const walletRoutes = router;