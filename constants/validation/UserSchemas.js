import { z } from 'zod';

export const createUserSchema = z.object({
    firstName: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    role: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().refine((data) => {
    if (Object.keys(data).length === 0) {
        const error = new Error()
        error.errors = [{
            path: ["Request body"],
            message: "Atleast one field is required to update"
        }]
        throw error
    }
    return true;
});
