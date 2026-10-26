import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { errorResponse, objectIdSchema, validationError } from "@/app/libs/api";

interface IParams {
    listingId?: string;
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<IParams> }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return errorResponse("You must be logged in", 401);
    }

    const parsedId = objectIdSchema.safeParse((await params).listingId);

    if (!parsedId.success) {
        return validationError(parsedId.error);
    }

    // The owner check is part of the query: a listing that belongs to
    // someone else simply does not match, so nothing is deleted.
    const result = await prisma.listing.deleteMany({
        where: {
            id: parsedId.data,
            userId: currentUser.id
        }
    });

    if (result.count === 0) {
        return errorResponse("Listing not found", 404);
    }

    return NextResponse.json({ success: true });
}
