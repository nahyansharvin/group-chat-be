import { Router } from "express";
import { createUser, getAllUsers, searchUsers, updateUser } from "../controllers/ProfileController.js";
import { isAdmin, verifyToken } from "../middlewares/AuthMiddleware.js";

const profileRoutes = Router();

profileRoutes.use(verifyToken)
profileRoutes.get("/all-users", getAllUsers)
profileRoutes.get("/search", searchUsers)

// Admin routes
profileRoutes.use(isAdmin)
profileRoutes.post("/create-user", createUser)
profileRoutes.patch("/update-user/:id", updateUser)

export default profileRoutes;