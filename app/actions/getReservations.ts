import { Prisma } from "@prisma/client";

import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;      // reservations made by this user (guest)
    authorId?: string;    // reservations on listings owned by this user (host)
}

export default async function getReservations(params: IParams) {
    const { listingId, userId, authorId } = params;

    const query: Prisma.ReservationWhereInput = {};

    if (listingId) {
        query.listingId = listingId;
    }

    if (userId) {
        query.userId = userId;
    }

    if (authorId) {
        query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
        where: query,
        include: {
            listing: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return reservations.map((reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
            ...reservation.listing,
            createdAt: reservation.listing.createdAt.toISOString()
        }
    }));
}
