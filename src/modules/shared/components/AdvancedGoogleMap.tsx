"use client";

import React, { useCallback, useState } from "react";
import { 
    GoogleMap as ReactGoogleMap, 
    useJsApiLoader, 
    Marker, 
    InfoWindow,
    MarkerClusterer 
} from "@react-google-maps/api";

interface AdvancedGoogleMapProps {
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
        infoContent?: React.ReactNode;
    }>;
    enableClustering?: boolean;
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
        },
        {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

const clusterOptions = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 60,
    maxZoom: 15
};

export function AdvancedGoogleMap({
    center = { lat: 10.3910, lng: -75.4794 }, // Cartagena de Indias default
    zoom = 13,
    className = "w-full h-96",
    onMapLoad,
    markers = [],
    enableClustering = true
}: AdvancedGoogleMapProps) {
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries
    });

    const onLoad = useCallback((map: google.maps.Map) => {
        onMapLoad?.(map);
    }, [onMapLoad]);

    const onUnmount = useCallback(() => {
        setSelectedMarker(null);
    }, []);

    const handleMarkerClick = useCallback((markerId: string, markerOnClick?: () => void) => {
        setSelectedMarker(selectedMarker === markerId ? null : markerId);
        markerOnClick?.();
    }, [selectedMarker]);

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

    const createMarkerIcon = (icon: string) => ({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="white" stroke="#374151" stroke-width="2"/>
                <text x="20" y="28" text-anchor="middle" font-size="18">${icon}</text>
            </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
    });

    const renderMarkers = () => {
        const markerElements = markers.map((marker) => (
            <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={marker.icon ? createMarkerIcon(marker.icon) : undefined}
                onClick={() => handleMarkerClick(marker.id, marker.onClick)}
            >
                {selectedMarker === marker.id && marker.infoContent && (
                    <InfoWindow
                        onCloseClick={() => setSelectedMarker(null)}
                        options={{
                            pixelOffset: new window.google.maps.Size(0, -40)
                        }}
                    >
                        <div className="p-2 max-w-xs">
                            {marker.infoContent}
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        ));

        if (enableClustering && markers.length > 5) {
            return (
                <MarkerClusterer options={clusterOptions}>
                    {(clusterer) => (
                        <>
                            {markerElements.map((marker) => 
                                React.cloneElement(marker, { clusterer })
                            )}
                        </>
                    )}
                </MarkerClusterer>
            );
        }

        return markerElements;
    };

    return (
        <div className={className}>
            <ReactGoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
                onClick={() => setSelectedMarker(null)}
            >
                {renderMarkers()}
            </ReactGoogleMap>
        </div>
    );
}
