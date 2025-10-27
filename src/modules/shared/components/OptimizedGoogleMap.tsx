"use client";

import { useCallback } from "react";
import { GoogleMap as ReactGoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface OptimizedGoogleMapProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
    onMapLoad?: (map: google.maps.Map) => void;
    markers?: Array<{
        id: string;
        position: { lat: number; lng: number };
        title?: string;
        icon?: string;
        onClick?: () => void;
    }>;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    scaleControl: true,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function OptimizedGoogleMap({
    center = { lat: 10.3910, lng: -75.4794 }, // Cartagena de Indias default
    zoom = 13,
    className = "w-full h-96",
    onMapLoad,
    markers = []
}: OptimizedGoogleMapProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries
    });

    const onLoad = useCallback((map: google.maps.Map) => {
        onMapLoad?.(map);
    }, [onMapLoad]);

    const onUnmount = useCallback(() => {
        // Cleanup if needed
    }, []);

    if (loadError) {
        return (
            <div className={`${className} bg-red-50 rounded-lg flex items-center justify-center`}>
                <div className="text-red-600">Error al cargar el mapa</div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`${className} bg-slate-100 rounded-lg flex items-center justify-center`}>
                <div className="text-slate-500">Cargando mapa...</div>
            </div>
        );
    }

    return (
        <div className={className}>
            <ReactGoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        icon={marker.icon ? {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <circle cx="16" cy="16" r="12" fill="white" stroke="#374151" stroke-width="2"/>
                                    <text x="16" y="22" text-anchor="middle" font-size="16">${marker.icon}</text>
                                </svg>
                            `)}`,
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 16)
                        } : undefined}
                        onClick={marker.onClick}
                    />
                ))}
            </ReactGoogleMap>
        </div>
    );
}
