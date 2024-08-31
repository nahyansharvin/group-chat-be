import { z } from "zod";

export const noBodySchema = z.object({}).strict({ message: "Request body not allowed" });

export const mongoIdSchema = z.object({
    groupId: z.string().refine((val) => val.length === 24, { message: "Invalid group ID" }),
    userId: z.string().refine((val) => val.length === 24, { message: "Invalid user ID" }),
}).partial();