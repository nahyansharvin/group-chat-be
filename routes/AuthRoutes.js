import { Router } from "express";
import { signup, signin, signout } from "../controllers/AuthController.js";
import { isAdmin, verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllUsers, getUser, updateUser } from "../controllers/ProfileController.js";

const authRoutes = Router();

authRoutes.post("/signin", signin)
authRoutes.post("/signout", signout)

authRoutes.use(verifyToken)
authRoutes.get("/user-info", getUser)
authRoutes.get("/all-users", getAllUsers)

// Admin routes
authRoutes.use(isAdmin)
authRoutes.post("/create-user", signup)
authRoutes.patch("/update-user/:id", updateUser)


export default authRoutes;