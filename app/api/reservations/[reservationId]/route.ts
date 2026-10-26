import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { errorResponse, objectIdSchema, validationError } from "@/app/libs/api";

interface IParams {
    reservationId?: string;
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<IParams> }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return errorResponse("You must be logged in", 401);
    }

    const parsedId = objectIdSchema.safeParse((await params).reservationId);

    if (!parsedId.success) {
        return validationError(parsedId.error);
    }

    // Both the guest who booked and the host of the listing may cancel.
    const result = await prisma.reservation.deleteMany({
        where: {
            id: parsedId.data,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } }
            ]
        }
    });

    if (result.count === 0) {
        return errorResponse("Reservation not found", 404);
    }

    return NextResponse.json({ success: true });
}
