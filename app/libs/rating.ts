// Turns a listing's reviews into the two numbers the UI shows:
// the average rating (rounded to one decimal) and how many reviews it has.
export function summarizeReviews(reviews: { rating: number }[]) {
    const reviewCount = reviews.length;

    if (reviewCount === 0) {
        return { averageRating: null, reviewCount };
    }

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const averageRating = Math.round((sum / reviewCount) * 10) / 10;

    return { averageRating, reviewCount };
}
