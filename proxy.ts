import { withAuth } from "next-auth/middleware";

// Guests opening a private page are sent to the home page,
// where they can log in through the login modal.
export default withAuth({
    pages: {
        signIn: "/",
    },
});

export const config = {
    matcher: [
        "/trips",
        "/reservations",
        "/properties",
        "/favorites",
    ]
}