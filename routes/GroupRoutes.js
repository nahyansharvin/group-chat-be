import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { addMembers, createGroup, deleteGroup, editGroup, getUserGroups, removeMembers, searchGroups } from "../controllers/GroupController.js";

const groupRouter = Router();

groupRouter.use(verifyToken)
groupRouter.get("/get-groups", getUserGroups)
groupRouter.get("/search", searchGroups)
groupRouter.post("/create-group", createGroup)
groupRouter.patch("/edit-group/:groupId", editGroup)
groupRouter.delete("/delete-group/:groupId", deleteGroup)
groupRouter.patch("/add-members/:groupId", addMembers)
groupRouter.patch("/remove-members/:groupId", removeMembers)


export default groupRouter;