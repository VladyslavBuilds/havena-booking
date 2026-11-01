'use client';

import dynamic from "next/dynamic";
import { BiMap, BiListUl } from "react-icons/bi";

import { SafeListing, SafeUser } from "@/app/types";
import useListingsView from "@/app/hooks/useListingsView";

import Hero from "../Hero";
import ListingCard from "./ListingCard";

// Leaflet needs the browser's window object, so the map is never
// rendered on the server.
const ListingsMap = dynamic(() => import("./ListingsMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[calc(100vh-13rem)] min-h-[420px] w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    ),
});

interface ListingsViewProps {
    listings: SafeListing[];
    currentUser?: SafeUser | null;
    // Show the landing banner above the grid (hidden in map view so the
    // map gets the whole screen)
    showHero?: boolean;
}

// The search results, either as a grid of cards or as a map with price
// markers. The floating button at the bottom switches between the two.
const ListingsView: React.FC<ListingsViewProps> = ({ listings, currentUser, showHero }) => {
    // Kept in a store (not local state) so the choice is remembered while
    // this component is temporarily unmounted, e.g. by an empty category.
    const { showMap, setShowMap } = useListingsView();

    const toggleView = () => {
        setShowMap(!showMap);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="relative flex flex-col gap-10">
            {showHero && !showMap && (
                <Hero currentUser={currentUser} listingCount={listings.length} />
            )}

            {showMap ? (
                <ListingsMap listings={listings} />
            ) : (
                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                ">
                    {listings.map((listing) => (
                        <ListingCard
                            currentUser={currentUser}
                            key={listing.id}
                            data={listing}
                        />
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={toggleView}
                className="
                    fixed
                    bottom-8
                    left-1/2
                    -translate-x-1/2
                    z-20
                    flex
                    flex-row
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-full
                    bg-neutral-900
                    text-white
                    dark:bg-white
                    dark:text-neutral-900
                    font-semibold
                    shadow-lg
                    hover:scale-105
                    transition
                "
            >
                {showMap ? (
                    <>
                        <BiListUl size={20} aria-hidden="true" />
                        Show list
                    </>
                ) : (
                    <>
                        <BiMap size={20} aria-hidden="true" />
                        Show map
                    </>
                )}
            </button>
        </div>
    );
};

export default ListingsView;
