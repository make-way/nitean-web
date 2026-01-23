import { z } from "zod";

export const postSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    summary: z.string().min(1),
    content: z.string(),
    status: z.enum(["Draft", "Review"]),
    userId: z.string(),
});


export type PostInput = z.infer<typeof postSchema>;
