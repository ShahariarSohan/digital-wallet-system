import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAgentZodSchema, updateAgentZodSchema } from "./agent.validation";
import { agentControllers } from "./agent.controller";
import { Role } from "../../interfaces/interface";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router();

router.post("/apply",validateRequest(createAgentZodSchema),agentControllers.createAgent)
router.get("/",checkAuth(Role.ADMIN),agentControllers.getAllAgent)
router.get("/me",checkAuth(Role.AGENT),agentControllers.getMe)
router.get("/:id",checkAuth(Role.ADMIN),agentControllers.getSingleAgent)
router.patch("/update/:id",checkAuth(Role.AGENT,Role.ADMIN),validateRequest(updateAgentZodSchema),agentControllers.updateAgent)
export const agentRoutes = router;