import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import getReviews from "@/app/actions/getReviews";
import { objectIdSchema } from "@/app/libs/api";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IParams {
    listingId?: string;
}

const ListingPage =  async ({ params }: { params: Promise<IParams> }) => {
    const resolvedParams = await params;

    // A URL like /listings/anything is "not found", not a server error:
    // Prisma throws on an id that is not a valid ObjectId.
    if (!objectIdSchema.safeParse(resolvedParams.listingId).success) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    const listing = await getListingById(resolvedParams);
    const reservations = await getReservations(resolvedParams);
    const reviews = await getReviews(resolvedParams);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                reviews={reviews}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
}

export default ListingPage;
