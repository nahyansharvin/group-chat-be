import { Router } from "express";
import { createUser, deleteUser, getAllUsers, searchUsers, updateUser } from "../controllers/ProfileController.js";
import { isAdmin, verifyToken } from "../middlewares/AuthMiddleware.js";

const profileRoutes = Router();

profileRoutes.use(verifyToken)
profileRoutes.get("/all-users", getAllUsers)
profileRoutes.get("/search", searchUsers)

// Admin routes
profileRoutes.use(isAdmin)
profileRoutes.post("/create-user", createUser)
profileRoutes.patch("/update-user/:userId", updateUser)
profileRoutes.delete("/delete/:userId", deleteUser)

export default profileRoutes;