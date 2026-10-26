import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { errorResponse, objectIdSchema, validationError } from "@/app/libs/api";

interface IParams {
    listingId?: string;
}

export async function POST(
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

    const listingId = parsedId.data;

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true },
    });

    if (!listing) {
        return errorResponse("Listing not found", 404);
    }

    if (currentUser.favoriteIds.includes(listingId)) {
        return NextResponse.json({ favoriteIds: currentUser.favoriteIds });
    }

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
            // Atomic append instead of rewriting the whole array.
            favoriteIds: { push: listingId }
        },
        select: { favoriteIds: true },
    });

    return NextResponse.json(user);
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

    const listingId = parsedId.data;

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
            favoriteIds: currentUser.favoriteIds.filter((id) => id !== listingId)
        },
        select: { favoriteIds: true },
    });

    return NextResponse.json(user);
}
