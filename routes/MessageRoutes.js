import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { editMessage, getMessages, markAsRead } from "../controllers/MessageController.js";

const messageRoutes = Router();

messageRoutes.use(verifyToken)
messageRoutes.get("/get-messages/:userId", getMessages)
messageRoutes.patch("/mark-as-read", markAsRead)
messageRoutes.patch("/edit-message", editMessage)

export default messageRoutes;