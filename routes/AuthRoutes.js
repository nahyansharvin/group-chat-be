import { Router } from "express";
import { signup, signin, signout, getUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup)
authRoutes.post("/signin", signin)
authRoutes.post("/signout", signout)
authRoutes.use(verifyToken)
authRoutes.get("/user-info", getUser)


export default authRoutes;