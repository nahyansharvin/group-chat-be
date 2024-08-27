import { Router } from "express";
import { signup, signin, signout } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup)
authRoutes.post("/signin", signin)
authRoutes.post("/signout", signout)


export default authRoutes;