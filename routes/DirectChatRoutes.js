import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getDirectChatList } from "../controllers/DirectChatController.js";

const directChatRouter = Router();

directChatRouter.use(verifyToken)
directChatRouter.get("/", getDirectChatList)

export default directChatRouter;