
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";
import { transactionControllers } from "./transaction.controller";

const router = Router()

router.get("/",checkAuth(Role.ADMIN),transactionControllers.getAllTransaction)

export const transactionRoutes = router;