import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getGroupMessages, getMessages, markAsRead } from "../controllers/MessageController.js";

const messageRoutes = Router();

messageRoutes.use(verifyToken)
messageRoutes.get("/get-user-messages/:userId", getMessages)
messageRoutes.get("/get-group-messages/:groupId", getGroupMessages)
messageRoutes.patch("/mark-as-read", markAsRead)

export default messageRoutes;