import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { errorResponse, readJson, validationError } from "@/app/libs/api";
import { reviewSchema } from "@/app/libs/schemas/review";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return errorResponse("You must be logged in", 401);
    }

    const parsed = reviewSchema.safeParse(await readJson(request));

    if (!parsed.success) {
        return validationError(parsed.error);
    }

    const { listingId, rating, comment } = parsed.data;

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, userId: true },
    });

    if (!listing) {
        return errorResponse("Listing not found", 404);
    }

    if (listing.userId === currentUser.id) {
        return errorResponse("You cannot review your own listing", 403);
    }

    // Only guests whose stay is already over may leave a review.
    const completedStay = await prisma.reservation.findFirst({
        where: {
            listingId,
            userId: currentUser.id,
            endDate: { lt: new Date() },
        },
        select: { id: true },
    });

    if (!completedStay) {
        return errorResponse("You can review a place after your stay there", 403);
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            userId_listingId: { userId: currentUser.id, listingId },
        },
        select: { id: true },
    });

    if (existingReview) {
        return errorResponse("You have already reviewed this place", 409);
    }

    try {
        const review = await prisma.review.create({
            data: {
                userId: currentUser.id,
                listingId,
                rating,
                comment,
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        // Two submissions at the same moment: the unique index rejects the second.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return errorResponse("You have already reviewed this place", 409);
        }

        throw error;
    }
}
