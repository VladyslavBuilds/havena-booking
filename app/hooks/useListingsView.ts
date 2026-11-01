import { create } from 'zustand';

interface ListingsViewStore {
    // true = results shown on the map, false = as a grid of cards
    showMap: boolean;
    setShowMap: (showMap: boolean) => void;
}

// The grid/map choice lives outside the results component so it survives
// the moments when that component is unmounted (an empty category shows
// EmptyState instead of the results) and navigation to a listing and back.
const useListingsView = create<ListingsViewStore>((set) => ({
    showMap: false,
    setShowMap: (showMap) => set({ showMap }),
}));

export default useListingsView;
