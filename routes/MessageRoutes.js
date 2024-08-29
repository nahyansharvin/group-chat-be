import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, markAsRead } from "../controllers/MessageController.js";

const messageRoutes = Router();

messageRoutes.use(verifyToken)
messageRoutes.get("/get-messages/:id", getMessages)
messageRoutes.patch("/mark-as-read", markAsRead)

export default messageRoutes;