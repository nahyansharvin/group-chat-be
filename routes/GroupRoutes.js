import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { addMembers, createGroup, deleteGroup, editGroup, getUserGroups, leaveGroup, removeMembers, searchGroups } from "../controllers/GroupController.js";
import { validateData, validateParams } from "../middlewares/ValidationMiddleware.js";
import { mongoIdSchema, noBodySchema } from "../constants/validation/commonSchemas.js";
import { createGroupSchema, editGroupSchema, groupMembersSchema } from "../constants/validation/GroupSchemas.js";

const groupRouter = Router();

groupRouter.use(verifyToken)
groupRouter.get("/get-groups", validateData(noBodySchema), getUserGroups)
groupRouter.get("/search", validateData(noBodySchema), searchGroups) //?fiter=groupname
groupRouter.post("/create-group", validateData(createGroupSchema), createGroup)
groupRouter.patch("/edit-group/:groupId", validateParams(mongoIdSchema), validateData(editGroupSchema), editGroup)
groupRouter.delete("/delete-group/:groupId", validateParams(mongoIdSchema), validateData(noBodySchema), deleteGroup)
groupRouter.patch("/add-members/:groupId", validateParams(mongoIdSchema), validateData(groupMembersSchema), addMembers)
groupRouter.patch("/remove-members/:groupId", validateParams(mongoIdSchema), validateData(groupMembersSchema), removeMembers)
groupRouter.patch("/leave-group/:groupId", validateParams(mongoIdSchema), validateData(noBodySchema), leaveGroup)


export default groupRouter;