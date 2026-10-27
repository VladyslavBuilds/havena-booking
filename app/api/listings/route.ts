import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { errorResponse, readJson, validationError } from "@/app/libs/api";
import { listingSchema } from "@/app/libs/schemas/listing";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return errorResponse("You must be logged in", 401);
    }

    const parsed = listingSchema.safeParse(await readJson(request));

    if (!parsed.success) {
        return validationError(parsed.error);
    }

    const { location, ...data } = parsed.data;

    const listing = await prisma.listing.create({
        data: {
            ...data,
            locationValue: location.value,
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing, { status: 201 });
}
