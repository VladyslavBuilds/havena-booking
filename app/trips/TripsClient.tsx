'use client';

import toast from "react-hot-toast";
import axios from "axios";
import getErrorMessage from "@/app/libs/getErrorMessage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

import { SafeReservation, SafeUser } from "../types";
import useReviewModal from "../hooks/useReviewModal";

interface TripsClientProps {
    reservations: SafeReservation[];
    // Reservations whose stay is already over (decided on the server)
    pastReservationIds?: string[];
    // Listings this user has already reviewed
    reviewedListingIds?: string[];
    currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    pastReservationIds = [],
    reviewedListingIds = [],
    currentUser
}) => {
    const router = useRouter();
    const reviewModal = useReviewModal();
    const [deletingId, setDeletingId] = useState('');

    const onReview = useCallback((listingId: string) => {
        reviewModal.onOpen(listingId);
    }, [reviewModal]);

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
        .then(() => {
            toast.success('Reservation cancelled');
            router.refresh();
        })
        .catch((error) => {
            toast.error(getErrorMessage(error));
        })
        .finally(() => {
            setDeletingId('');
        });
    }, [router]);

    return (
        <Container>
            <Heading 
                title="Trips"
                subtitle="Where you've been and where you're going"
            />
            <div 
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                ">
                {reservations.map((reservation) => {
                    const isPast = pastReservationIds.includes(reservation.id);
                    const isReviewed = reviewedListingIds.includes(reservation.listingId);

                    // Upcoming trip: it can be cancelled.
                    if (!isPast) {
                        return (
                            <ListingCard
                                key={reservation.id}
                                data={reservation.listing}
                                reservation={reservation}
                                actionId={reservation.id}
                                onAction={onCancel}
                                disabled={deletingId === reservation.id}
                                actionLabel="Cancel reservation"
                                currentUser={currentUser}
                            />
                        );
                    }

                    // Past trip: it can be reviewed once.
                    return (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.listingId}
                            onSecondaryAction={isReviewed ? undefined : onReview}
                            secondaryActionLabel="Leave a review"
                            note={isReviewed ? "You reviewed this stay" : undefined}
                            currentUser={currentUser}
                        />
                    );
                })}
            </div>
        </Container>
    );
}

export default TripsClient;