import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";
import { statsControllers } from "./stats.controller";

const router = Router();

router.get(
  "/user",
    checkAuth(Role.ADMIN),
statsControllers.getUserStats
  
);
router.get(
  "/agent",
    checkAuth(Role.ADMIN),
  statsControllers.getAgentStats
  
);
router.get(
  "/wallet",
    checkAuth(Role.ADMIN),
  statsControllers.getWalletStats
  
);
router.get(
  "/transaction",
    checkAuth(Role.ADMIN,Role.AGENT),
  statsControllers.getTransactionStats
  
);
router.get(
  "/myTransaction",
    checkAuth(Role.AGENT,Role.USER),
  statsControllers.getMyTransactionStats
  
);

export const statRoutes = router;
