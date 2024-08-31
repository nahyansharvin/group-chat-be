import { z } from "zod";

export const noBodySchema = z.object({}).strict({ message: "Request body not allowed" });