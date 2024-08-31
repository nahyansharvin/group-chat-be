import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getDirectChatList } from "../controllers/DirectChatController.js";
import { validateData } from "../middlewares/ValidationMiddleware.js";
import { noBodySchema } from "../constants/validation/commonSchemas.js";

const directChatRouter = Router();

directChatRouter.use(verifyToken)
directChatRouter.get("/", validateData(noBodySchema), getDirectChatList)

export default directChatRouter;