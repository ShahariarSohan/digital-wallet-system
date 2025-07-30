import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post("/login",authControllers.credentialsLogin)
router.post("/logout",authControllers.logout)

export const authRoutes = router;