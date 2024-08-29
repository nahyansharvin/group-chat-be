import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createGroup, deleteGroup, editGroup } from "../controllers/GroupController.js";

const groupRouter = Router();

groupRouter.use(verifyToken)
groupRouter.post("/create-group", createGroup)
groupRouter.patch("/edit-group/:groupId", editGroup)
groupRouter.delete("/delete-group/:groupId", deleteGroup)

export default groupRouter;