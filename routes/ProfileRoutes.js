import { Router } from "express";
import { createUser, deleteUser, getAllUsers, searchUsers, updateUser } from "../controllers/ProfileController.js";
import { isAdmin, verifyToken } from "../middlewares/AuthMiddleware.js";
import { validateData, validateParams } from "../middlewares/ValidationMiddleware.js";
import { createUserSchema, updateUserSchema } from "../constants/validation/userSchemas.js";
import { mongoIdSchema, noBodySchema } from "../constants/validation/commonSchemas.js";

const profileRoutes = Router();

profileRoutes.use(verifyToken)
profileRoutes.get("/all-users", validateData(noBodySchema), getAllUsers)
profileRoutes.get("/search", validateData(noBodySchema), searchUsers) // ?filter=abc

// Admin routes
profileRoutes.use(isAdmin)
profileRoutes.post("/create-user", validateData(createUserSchema), createUser)
profileRoutes.patch("/update-user/:userId", validateParams(mongoIdSchema), validateData(updateUserSchema), updateUser)
profileRoutes.delete("/delete/:userId", validateParams(mongoIdSchema), validateData(noBodySchema), deleteUser)

export default profileRoutes;