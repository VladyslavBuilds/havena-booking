'use client';

import { useTheme } from "next-themes";
import { TileLayer } from "react-leaflet";

// Map tiles that match the theme: OpenStreetMap's standard style in light
// mode, Esri's "Dark Gray Canvas" in dark mode (a base layer plus a
// separate layer with place names). Both are free to use with attribution
// and need no API key.
const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ESRI_DARK_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ESRI_DARK_LABELS_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ';

const ThemedTileLayer = () => {
    const { resolvedTheme } = useTheme();

    // `key` makes Leaflet replace the layers when the theme changes;
    // a TileLayer does not pick up a new url by itself.
    if (resolvedTheme === "dark") {
        return (
            <>
                <TileLayer key="dark-base" url={ESRI_DARK_URL} attribution={ESRI_ATTRIBUTION} maxZoom={16} />
                <TileLayer key="dark-labels" url={ESRI_DARK_LABELS_URL} maxZoom={16} />
            </>
        );
    }

    return <TileLayer key="light" url={OSM_URL} attribution={OSM_ATTRIBUTION} />;
};

export default ThemedTileLayer;
