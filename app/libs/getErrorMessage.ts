import axios from "axios";

// Extracts the { error: "message" } sent by our API routes from a failed
// axios request, falling back to a generic text for network errors.
export default function getErrorMessage(
    error: unknown,
    fallback = "Something went wrong."
) {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error;

        if (typeof message === "string" && message.length > 0) {
            return message;
        }
    }

    return fallback;
}
