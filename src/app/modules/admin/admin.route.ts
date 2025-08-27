import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminSettingsSchema, createAdminZodSchema } from "./admin.validation";
import { adminControllers } from "./admin.controller";
import { Role } from "../../interfaces/interface";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router();

router.post("/register",validateRequest(createAdminZodSchema),adminControllers.createAdmin)
router.get("/me",checkAuth(Role.ADMIN),adminControllers.getMe)
router.patch(
  "/settings/:id",
  checkAuth(Role.ADMIN),
  validateRequest(adminSettingsSchema),
  adminControllers.updateAdminSettings
);
export const adminRoutes = router;