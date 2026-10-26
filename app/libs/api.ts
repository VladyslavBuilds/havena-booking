import { NextResponse } from "next/server";
import { z, type ZodError } from "zod";

// Helpers shared by the API route handlers in app/api.

// Every error leaves the API in the same shape: { error: "message" }
// with a meaningful HTTP status, so the client can show the message.
export function errorResponse(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

// Turns the first validation issue into a 400 response.
export function validationError(error: ZodError) {
    const issue = error.issues[0];

    // The whole body is missing or not an object (e.g. malformed JSON).
    if (issue?.code === "invalid_type" && issue.path.length === 0) {
        return errorResponse("Invalid request body", 400);
    }

    return errorResponse(issue?.message ?? "Invalid input", 400);
}

// Reads the JSON body; returns null when the body is missing or malformed
// instead of throwing (which would turn into a 500).
export async function readJson(request: Request): Promise<unknown> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

// MongoDB ObjectId: 24 hexadecimal characters.
export const objectIdSchema = z
    .string({ error: "Invalid id" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
