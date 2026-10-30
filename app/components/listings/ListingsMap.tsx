'use client';

import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing } from "@/app/types";

import RatingBadge from "./RatingBadge";

interface ListingsMapProps {
    listings: SafeListing[];
}

interface MapListing {
    listing: SafeListing;
    position: [number, number];
}

// Listings only store a country, so several of them share the same
// coordinates. Spread the ones in the same country on a small ring so
// every price label stays clickable.
const spreadOnRing = (center: [number, number], index: number, total: number): [number, number] => {
    if (total === 1) {
        return center;
    }

    const radius = 1.2; // degrees
    const angle = (2 * Math.PI * index) / total;

    return [
        center[0] + radius * Math.cos(angle),
        center[1] + radius * Math.sin(angle),
    ];
};

// A marker that shows the price instead of a pin.
const priceIcon = (price: number) =>
    L.divIcon({
        className: "",
        html: `<div class="px-3 py-1 rounded-full bg-white border border-neutral-300 shadow-md text-sm font-semibold text-neutral-800 whitespace-nowrap hover:scale-110 hover:bg-neutral-900 hover:text-white transition">$${price}</div>`,
        iconSize: undefined,
        iconAnchor: [28, 14],
        popupAnchor: [0, -14],
    });

// Zooms the map so that every marker is visible.
const FitToMarkers = ({ positions }: { positions: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (positions.length === 0) {
            return;
        }

        map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 6 });
    }, [map, positions]);

    return null;
};

const ListingsMap: React.FC<ListingsMapProps> = ({ listings }) => {
    const { getByValue } = useCountries();

    const items = useMemo<MapListing[]>(() => {
        const byCountry = new Map<string, SafeListing[]>();

        for (const listing of listings) {
            const group = byCountry.get(listing.locationValue) ?? [];
            group.push(listing);
            byCountry.set(listing.locationValue, group);
        }

        const result: MapListing[] = [];

        for (const [locationValue, group] of byCountry) {
            const center = getByValue(locationValue)?.latlng;

            if (!center) {
                continue;
            }

            group.forEach((listing, index) => {
                result.push({
                    listing,
                    position: spreadOnRing(center, index, group.length),
                });
            });
        }

        return result;
    }, [listings, getByValue]);

    const positions = useMemo(() => items.map((item) => item.position), [items]);

    return (
        <MapContainer
            center={[30, 10]}
            zoom={2}
            scrollWheelZoom
            className="h-[calc(100vh-13rem)] min-h-[420px] w-full rounded-2xl"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToMarkers positions={positions} />

            {items.map(({ listing, position }) => (
                <Marker
                    key={listing.id}
                    position={position}
                    icon={priceIcon(listing.price)}
                    riseOnHover   // bring an overlapping label to the front when hovered
                >
                    <Popup minWidth={220} maxWidth={220}>
                        <Link href={`/listings/${listing.id}`} className="block no-underline text-neutral-800">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                                <Image
                                    src={listing.imageSrc}
                                    alt={listing.title}
                                    fill
                                    sizes="220px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="mt-2 font-semibold leading-snug">{listing.title}</div>
                            <div className="mt-1 flex flex-row items-center justify-between text-sm">
                                <span><span className="font-semibold">${listing.price}</span> night</span>
                                <RatingBadge
                                    averageRating={listing.averageRating}
                                    reviewCount={listing.reviewCount}
                                />
                            </div>
                        </Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ListingsMap;
