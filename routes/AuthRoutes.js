import { Router } from "express";
import { signin, signout, getCurrentUser } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { validateData } from "../middlewares/ValidationMiddleware.js";
import { noBodySchema } from "../constants/validation/commonSchemas.js";
import { signInSchema } from "../constants/validation/userSchemas.js";

const authRoutes = Router();

authRoutes.post("/signin", validateData(signInSchema), signin)
authRoutes.post("/signout", validateData(noBodySchema), signout)

authRoutes.use(verifyToken)
authRoutes.get("/user-info", validateData(noBodySchema), getCurrentUser)


export default authRoutes;