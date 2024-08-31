import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getGroupMessages, getMessages, markAsRead } from "../controllers/MessageController.js";
import { validateData, validateParams } from "../middlewares/ValidationMiddleware.js";
import { mongoIdSchema, noBodySchema } from "../constants/validation/commonSchemas.js";

const messageRoutes = Router();

messageRoutes.use(verifyToken)
messageRoutes.get("/get-user-messages/:userId", validateParams(mongoIdSchema), validateData(noBodySchema), getMessages)
messageRoutes.get("/get-group-messages/:groupId", validateParams(mongoIdSchema), validateData(noBodySchema), getGroupMessages)
messageRoutes.patch("/mark-as-read", validateData(mongoIdSchema), markAsRead)

export default messageRoutes;