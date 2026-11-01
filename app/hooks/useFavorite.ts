import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { SafeUser } from "../types";
import getErrorMessage from "../libs/getErrorMessage";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    // What the server knows (comes with the page as a prop).
    const serverValue = (currentUser?.favoriteIds || []).includes(listingId);

    // Optimistic update: the heart changes colour the moment it is clicked,
    // the request runs in the background and the colour is rolled back only
    // if the request fails. `null` means "no pending guess, show the server
    // value". Once a fresh server value arrives (router.refresh), the guess
    // is dropped so the server stays the source of truth.
    const [optimistic, setOptimistic] = useState<boolean | null>(null);
    const [seenServerValue, setSeenServerValue] = useState(serverValue);

    if (seenServerValue !== serverValue) {
        setSeenServerValue(serverValue);
        setOptimistic(null);
    }

    const hasFavorited = optimistic ?? serverValue;

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();

        if(!currentUser) {
            return loginModal.onOpen();
        }

        const next = !hasFavorited;
        setOptimistic(next);

        try {
            if (next) {
                await axios.post(`/api/favorites/${listingId}`);
            } else {
                await axios.delete(`/api/favorites/${listingId}`);
            }

            // Bring the rest of the page (favorites list, counters) up to date
            router.refresh();
        } catch (error) {
            setOptimistic(null);
            toast.error(getErrorMessage(error));
        }
    },
    [
        currentUser,
        hasFavorited,
        listingId,
        loginModal,
        router
    ]);

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite;
