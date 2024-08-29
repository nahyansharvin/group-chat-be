import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createGroup, deleteGroup, editGroup, searchGroups } from "../controllers/GroupController.js";

const groupRouter = Router();

groupRouter.use(verifyToken)
groupRouter.get("/search", searchGroups)
groupRouter.post("/create-group", createGroup)
groupRouter.patch("/edit-group/:groupId", editGroup)
groupRouter.delete("/delete-group/:groupId", deleteGroup)


export default groupRouter;