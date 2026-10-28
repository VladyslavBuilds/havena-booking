import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export default async function getReviews(params: IParams) {
    const { listingId } = params;

    const reviews = await prisma.review.findMany({
        where: { listingId },
        include: {
            // Only what the review card shows; never the whole user record.
            user: {
                select: { name: true, image: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
    }));
}
