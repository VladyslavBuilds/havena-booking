import { format } from "date-fns";
import { AiFillStar } from "react-icons/ai";

import { SafeReview } from "@/app/types";

import Avatar from "../Avatar";
import RatingBadge from "./RatingBadge";

interface ListingReviewsProps {
    reviews: SafeReview[];
    averageRating?: number | null;
}

const ListingReviews: React.FC<ListingReviewsProps> = ({
    reviews,
    averageRating
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center gap-2 text-xl font-semibold">
                <RatingBadge
                    averageRating={averageRating}
                    reviewCount={reviews.length}
                    showCount
                />
            </div>

            {reviews.length === 0 && (
                <div className="font-light text-neutral-500">
                    No reviews yet. Guests can leave one after their stay.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="flex flex-col gap-2">
                        <div className="flex flex-row items-center gap-3">
                            <Avatar src={review.user.image} />
                            <div className="flex flex-col">
                                <div className="font-semibold">
                                    {review.user.name ?? "Guest"}
                                </div>
                                <div className="text-sm font-light text-neutral-500">
                                    {format(new Date(review.createdAt), "MMMM yyyy")}
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-row"
                            aria-label={`${review.rating} out of 5 stars`}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <AiFillStar
                                    key={star}
                                    size={16}
                                    aria-hidden="true"
                                    className={star <= review.rating ? "text-neutral-800" : "text-neutral-300"}
                                />
                            ))}
                        </div>
                        <div className="font-light text-neutral-600 whitespace-pre-line">
                            {review.comment}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListingReviews;
