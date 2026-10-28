'use client';

import { AiFillStar } from "react-icons/ai";

interface StarRatingProps {
    value: number;                    // 0 = nothing picked yet
    onChange: (value: number) => void;
    disabled?: boolean;
}

const LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

// Controlled 1-5 star picker: shows `value`, reports a new value via onChange.
const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    disabled
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                        disabled={disabled}
                        onClick={() => onChange(star)}
                        className="
                            p-1
                            transition
                            hover:scale-110
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                        "
                    >
                        <AiFillStar
                            size={32}
                            className={star <= value ? "text-rose-500" : "text-neutral-300"}
                        />
                    </button>
                ))}
            </div>
            <div className="text-sm font-light text-neutral-500 h-5">
                {LABELS[value]}
            </div>
        </div>
    );
}

export default StarRating;
