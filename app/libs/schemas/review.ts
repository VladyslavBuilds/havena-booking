import { z } from "zod";

import { objectIdSchema } from "@/app/libs/api";

export const reviewSchema = z.object({
    listingId: objectIdSchema,
    rating: z
        .number({ error: "Please pick a rating" })
        .int("Rating must be a whole number")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    comment: z
        .string({ error: "Please write a few words" })
        .trim()
        .min(3, "Please write a few words")
        .max(1000, "Comment is too long"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
