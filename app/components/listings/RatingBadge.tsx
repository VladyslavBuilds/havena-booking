import { AiFillStar } from "react-icons/ai";

interface RatingBadgeProps {
    averageRating?: number | null;
    reviewCount?: number;
    // Show the number of reviews next to the average ("4.8 · 12 reviews")
    showCount?: boolean;
}

// "★ 4.8" for a listing with reviews, "New" for one without.
const RatingBadge: React.FC<RatingBadgeProps> = ({
    averageRating,
    reviewCount = 0,
    showCount
}) => {
    if (averageRating == null || reviewCount === 0) {
        return (
            <span className="font-light text-neutral-500 dark:text-neutral-400">New</span>
        );
    }

    const label = reviewCount === 1 ? "review" : "reviews";

    return (
        <span className="flex flex-row items-center gap-1">
            <AiFillStar size={16} aria-hidden="true" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            {showCount && (
                <span className="font-light text-neutral-500 dark:text-neutral-400">
                    · {reviewCount} {label}
                </span>
            )}
        </span>
    );
}

export default RatingBadge;
