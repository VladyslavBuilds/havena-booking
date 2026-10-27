import { Listing, Reservation, Review, User } from "@prisma/client";

export type SafeListing = Omit<
    Listing,
    "createdAt"
> & {
    createdAt: string;
    // Present when the query included the listing's reviews
    averageRating?: number | null;
    reviewCount?: number;
}

export type SafeReview = Omit<
    Review,
    "createdAt"
> & {
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}

export type SafeUser = Omit<
User,
"createdAt" | "updatedAt" | "emailVerified" | "hashedPassword"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};