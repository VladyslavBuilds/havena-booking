import { Prisma } from "@prisma/client";

import prisma from "@/app/libs/prismadb";

// Values come from the URL (searchParams), so numbers arrive as strings.
export interface IListingsParams {
    userId?: string;
    guestCount?: string;
    roomCount?: string;
    bathroomCount?: string;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(params: IListingsParams) {
    const {
        userId,
        roomCount,
        guestCount,
        bathroomCount,
        locationValue,
        startDate,
        endDate,
        category
    } = params;

    const query: Prisma.ListingWhereInput = {};

    if (userId) {
        query.userId = userId;
    }

    if (category) {
        query.category = category;
    }

    if (roomCount) {
        query.roomCount = {
            gte: +roomCount
        };
    }

    if (guestCount) {
        query.guestCount = {
            gte: +guestCount
        };
    }

    if (bathroomCount) {
        query.bathroomCount = {
            gte: +bathroomCount
        };
    }

    if (locationValue) {
        query.locationValue = locationValue;
    }

    if (startDate && endDate) {
        // Two date ranges overlap when each one starts
        // before (or on the day) the other one ends.
        query.NOT = {
            reservations: {
                some: {
                    startDate: { lte: endDate },
                    endDate: { gte: startDate },
                }
            }
        }
    }

    const listings = await prisma.listing.findMany({
        where: query,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return listings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
    }));
}
