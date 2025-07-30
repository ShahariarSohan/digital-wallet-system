import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAgentZodSchema } from "./agent.validation";
import { agentControllers } from "./agent.controller";


const router = Router();

router.post("/apply",validateRequest(createAgentZodSchema),agentControllers.createAgent)

export const agentRoutes = router;