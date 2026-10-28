import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import TripsClient from "./TripsClient";

import getCurrentUser from "../actions/getCurrentUser"
import getReservations from "../actions/getReservations";
import getReviewedListingIds from "../actions/getReviewedListingIds";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="Please log in"
                />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({
        userId: currentUser.id
    });
    const reviewedListingIds = await getReviewedListingIds(currentUser.id);

    // Decided here, on the server, so the client component stays pure.
    const now = new Date();
    const pastReservationIds = reservations
        .filter((reservation) => new Date(reservation.endDate) < now)
        .map((reservation) => reservation.id);

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No trips found"
                    subtitle="Looks like you haven't reserved any trips."
                />
            </ClientOnly>                
        )
    }

    return (
        <ClientOnly>
            <TripsClient
                reservations={reservations}
                pastReservationIds={pastReservationIds}
                reviewedListingIds={reviewedListingIds}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage;