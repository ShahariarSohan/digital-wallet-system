import { Router } from "express";

export const router = Router();

const moduleRoutes:any[] = []

moduleRoutes.forEach(route=>router.use(route.path,route.route))