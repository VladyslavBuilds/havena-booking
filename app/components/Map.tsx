'use client';

import L from "leaflet";
import type { StaticImageData } from "next/image";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

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

interface MapProps {
    center?: number[]
}

const Map: React.FC<MapProps> = ({
    center
}) => {
    return (
        <MapContainer
        center={center as L.LatLngExpression || [51, -0.9]}
        zoom={center ? 4 : 2}
        scrollWheelZoom={false}
        className="h-[35vh] rounded-lg"
        >
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && (
                <Marker 
                    position={center as L.LatLngExpression}
                />
            )}
        </MapContainer>
    )
};

export default Map;