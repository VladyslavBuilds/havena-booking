import prisma from "@/app/libs/prismadb";

// Ids of the listings the given user has already reviewed, so the trips
// page can offer "Leave a review" only where it is still possible.
export default async function getReviewedListingIds(userId: string) {
    const reviews = await prisma.review.findMany({
        where: { userId },
        select: { listingId: true }
    });

    return reviews.map((review) => review.listingId);
}
