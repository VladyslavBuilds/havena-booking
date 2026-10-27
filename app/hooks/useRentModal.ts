import { create } from 'zustand';

import { SafeListing } from '@/app/types';

interface RentModalStore {
    isOpen: boolean;
    // The listing being edited; null means the modal creates a new one.
    listing: SafeListing | null;
    onOpen: () => void;
    onEdit: (listing: SafeListing) => void;
    onClose: () => void;
}

const useRentModal = create<RentModalStore>((set) => ({
    isOpen: false,
    listing: null,
    onOpen: () => set({ isOpen: true, listing: null }),
    onEdit: (listing) => set({ isOpen: true, listing }),
    onClose: () => set({ isOpen: false, listing: null }),
}))

export default useRentModal;
