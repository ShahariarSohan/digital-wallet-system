import { NextFunction, Request, Response,Router } from "express";
import { authControllers } from "./auth.controller";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { forgetPasswordZodSchema, resetPasswordZodSchema } from "./auth.validation";

const router = Router()

router.post("/login",authControllers.credentialsLogin)
router.post("/logout", authControllers.logout)
router.post("/change-password", checkAuth(Role.AGENT, Role.USER), authControllers.changePassword)
router.post("/forget-password",validateRequest(forgetPasswordZodSchema), authControllers.forgetPassword)
router.post("/reset-password", checkAuth(Role.AGENT, Role.USER),validateRequest(resetPasswordZodSchema), authControllers.resetPassword)
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google",{scope:["profile","email"],state:redirect as string})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${envVars.FRONTEND_URL}/login?error=issue in your account`}),authControllers.googleCallbackController)
export const authRoutes = router;