import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { agentRoutes } from "../modules/agent/agent.route";
import { authRoutes } from "../modules/auth/auth.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { walletRoutes } from "../modules/wallet/wallet.route";
import { transactionRoutes } from "../modules/transaction/transaction.route";
import { statRoutes } from "../modules/stats/stats.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/agent",
    route: agentRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/wallet",
    route: walletRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/stats",
    route: statRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
