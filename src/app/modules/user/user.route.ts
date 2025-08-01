import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../interfaces/interface";


const router = Router();

router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser)
router.get("/",checkAuth(Role.ADMIN),userControllers.getAllUser)
router.get("/me",checkAuth(Role.USER),userControllers.getMe)
router.get("/:id",checkAuth(...Object.values(Role)),userControllers.getSingleUser)
router.patch("/update/:id",checkAuth(Role.USER,Role.ADMIN),validateRequest(updateUserZodSchema),userControllers.updateUser)
export const userRoutes = router;