import prisma from "@/app/libs/prismadb"
import { summarizeReviews } from "@/app/libs/rating";

interface IParams {
    listingId?: string;
}

export default async function getListingById(params: IParams) {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
        },
        include: {
            user: {
                omit: {
                    hashedPassword: true
                }
            },
            reviews: { select: { rating: true } }
        }
    });

    if (!listing) {
        return null;
    }

    const { reviews, ...rest } = listing;

    return {
        ...rest,
        ...summarizeReviews(reviews),
        createdAt: listing.createdAt.toISOString(),
        user: {
            ...listing.user,
            createdAt: listing.user.createdAt.toISOString(),
            updatedAt: listing.user.updatedAt.toISOString(),
            emailVerified: listing.user.emailVerified?.toISOString() || null,
        }
    };
}
