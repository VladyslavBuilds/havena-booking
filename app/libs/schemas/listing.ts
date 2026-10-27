import { z } from "zod";

// Shape of a listing as submitted by the rent modal.
// Shared by POST /api/listings (create) and PATCH /api/listings/[id] (edit).
export const listingSchema = z.object({
    title: z
        .string({ error: "Title is required" })
        .trim()
        .min(1, "Title is required")
        .max(100, "Title is too long"),
    description: z
        .string({ error: "Description is required" })
        .trim()
        .min(1, "Description is required")
        .max(2000, "Description is too long"),
    // Photos are uploaded to Cloudinary; next/image only allows that host.
    imageSrc: z
        .url("Please upload a photo")
        .startsWith("https://res.cloudinary.com/", "Please upload a photo"),
    category: z
        .string({ error: "Please select a category" })
        .trim()
        .min(1, "Please select a category"),
    roomCount: z
        .number({ error: "Room count must be a number" })
        .int()
        .min(1, "At least one room is required"),
    bathroomCount: z
        .number({ error: "Bathroom count must be a number" })
        .int()
        .min(1, "At least one bathroom is required"),
    guestCount: z
        .number({ error: "Guest count must be a number" })
        .int()
        .min(1, "At least one guest is required"),
    location: z.object(
        { value: z.string().length(3, "Please select a location") },
        { error: "Please select a location" }
    ),
    // The price input is a text field, so the value arrives as a string.
    price: z.coerce
        .number({ error: "Price must be a number" })
        .int("Price must be a whole number")
        .min(1, "Price must be at least $1")
        .max(1_000_000, "Price is too high"),
});

export type ListingInput = z.infer<typeof listingSchema>;
