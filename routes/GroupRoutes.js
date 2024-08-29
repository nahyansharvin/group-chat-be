import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createGroup, editGroup } from "../controllers/GroupController.js";

const groupRouter = Router();

groupRouter.use(verifyToken)
groupRouter.post("/create-group", createGroup)
groupRouter.patch("/edit-group/:id", editGroup)

export default groupRouter;