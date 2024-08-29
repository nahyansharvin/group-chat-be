import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessageController.js";

const messageRoutes = Router();

messageRoutes.use(verifyToken)
messageRoutes.get("/get-messages/:id", getMessages)

export default messageRoutes;