import { Router } from "express";
import { signin, signout, getCurrentUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signin", signin)
authRoutes.post("/signout", signout)

authRoutes.use(verifyToken)
authRoutes.get("/user-info", getCurrentUser)


export default authRoutes;