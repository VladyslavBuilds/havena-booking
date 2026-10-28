import prisma from "@/app/libs/prismadb";
import { summarizeReviews } from "@/app/libs/rating";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return [];
    }

    const favorites = await prisma.listing.findMany({
        where: {
            id: {
                in: currentUser.favoriteIds
            }
        },
        include: {
            reviews: { select: { rating: true } }
        }
    });

    return favorites.map(({ reviews, ...favorite }) => ({
        ...favorite,
        ...summarizeReviews(reviews),
        createdAt: favorite.createdAt.toISOString()
    }));
}
