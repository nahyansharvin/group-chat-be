import { z } from "zod";

export const createGroupSchema = z.object({
    name: z.string().min(2).max(50),
    members: z.string().array().optional(),
});

export const editGroupSchema = createGroupSchema.omit({ members: true });

export const groupMembersSchema = z.object({
    members: z.string().array().nonempty(),
});