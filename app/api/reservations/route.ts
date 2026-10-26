import { NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {
    errorResponse,
    objectIdSchema,
    readJson,
    validationError
} from "@/app/libs/api";

const ONE_DAY = 24 * 60 * 60 * 1000;

const createReservationSchema = z
    .object({
        listingId: objectIdSchema,
        startDate: z.coerce.date({ error: "Please select a start date" }),
        endDate: z.coerce.date({ error: "Please select an end date" }),
    })
    .refine((data) => data.endDate >= data.startDate, {
        error: "End date must be after start date",
        path: ["endDate"],
    })
    // One day of tolerance so "today" is accepted in every time zone.
    .refine((data) => data.startDate.getTime() >= Date.now() - ONE_DAY, {
        error: "Start date cannot be in the past",
        path: ["startDate"],
    });

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return errorResponse("You must be logged in", 401);
    }

    const parsed = createReservationSchema.safeParse(await readJson(request));

    if (!parsed.success) {
        return validationError(parsed.error);
    }

    const { listingId, startDate, endDate } = parsed.data;

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true, price: true },
    });

    if (!listing) {
        return errorResponse("Listing not found", 404);
    }

    // Same interval-overlap check as the date filter in getListings.
    const conflict = await prisma.reservation.findFirst({
        where: {
            listingId,
            startDate: { lte: endDate },
            endDate: { gte: startDate },
        },
        select: { id: true },
    });

    if (conflict) {
        return errorResponse("These dates are already booked", 409);
    }

    // The price is calculated here, never taken from the request.
    const nights = differenceInCalendarDays(endDate, startDate);
    const totalPrice = nights > 0 ? nights * listing.price : listing.price;

    const reservation = await prisma.reservation.create({
        data: {
            userId: currentUser.id,
            listingId,
            startDate,
            endDate,
            totalPrice,
        }
    });

    return NextResponse.json(reservation, { status: 201 });
}
