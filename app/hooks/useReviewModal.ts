import { create } from 'zustand';

interface ReviewModalStore {
    isOpen: boolean;
    // The listing the review is for
    listingId: string | null;
    onOpen: (listingId: string) => void;
    onClose: () => void;
}

const useReviewModal = create<ReviewModalStore>((set) => ({
    isOpen: false,
    listingId: null,
    onOpen: (listingId) => set({ isOpen: true, listingId }),
    onClose: () => set({ isOpen: false, listingId: null }),
}))

export default useReviewModal;
