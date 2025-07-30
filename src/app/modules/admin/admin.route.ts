import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema } from "./admin.validation";
import { adminControllers } from "./admin.controller";


const router = Router();

router.post("/register",validateRequest(createAdminZodSchema),adminControllers.createAdmin)

export const adminRoutes = router;