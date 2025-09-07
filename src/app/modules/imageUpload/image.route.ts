import { multerUpload } from './../../config/multer';
import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { imageControllers } from "./image.controller";
import { Role } from '../../interfaces/interface';



const router = Router();
router.patch("/upload/:id",checkAuth(Role.USER,Role.AGENT),multerUpload.single("file"),imageControllers.imageUpload)


export const imageRoutes = router;