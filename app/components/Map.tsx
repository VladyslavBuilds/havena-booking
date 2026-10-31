'use client';

import L from "leaflet";
import type { StaticImageData } from "next/image";
import { useEffect } from "react";
import { MapContainer, Marker, useMap } from "react-leaflet";

import ThemedTileLayer from "./ThemedTileLayer";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Image imports from node_modules resolve to a plain URL string here,
// while Next.js types them as StaticImageData ({ src, ... }).
// Support both so the marker never ends up without an icon URL.
const toUrl = (image: string | StaticImageData) =>
    typeof image === "string" ? image : image.src;

// @ts-expect-error _getIconUrl is an internal Leaflet property without a type
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: toUrl(markerIcon),
    iconRetinaUrl: toUrl(markerIcon2x),
    shadowUrl: toUrl(markerShadow)
});

// Roughly the middle of Europe, shown until a country is selected.
const DEFAULT_CENTER: [number, number] = [51, -0.9];

interface MapProps {
    center?: [number, number];
}

interface RecenterMapProps {
    center: [number, number];
    zoom: number;
}

// MapContainer reads `center` and `zoom` only once, when the map is
// created. This helper moves the existing map whenever they change.
const RecenterMap = ({ center, zoom }: RecenterMapProps) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
};

const Map: React.FC<MapProps> = ({ center }) => {
    const position = center ?? DEFAULT_CENTER;
    const zoom = center ? 4 : 2;

    return (
        <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-lg"
        >
            <RecenterMap center={position} zoom={zoom} />
            <ThemedTileLayer />
            {center && (
                <Marker position={center} />
            )}
        </MapContainer>
    )
};

export default Map;
