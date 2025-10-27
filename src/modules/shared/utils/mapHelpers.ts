import type { IncidentListItem } from "@/mocks/incidents";
import type { DriverListItem } from "@/mocks/drivers";

// Map marker types
export interface MapMarker {
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
    type: 'incident' | 'driver' | 'vehicle' | 'delivery';
    data?: IncidentListItem | DriverListItem | unknown;
    infoContent?: React.ReactNode;
}

// Import React for JSX
import React from 'react';

// Convert incidents to map markers
export function incidentsToMarkers(incidents: IncidentListItem[]): MapMarker[] {
    return incidents.map(incident => ({
        id: `incident-${incident.id}`,
        position: incident.StopLocation || { lat: 10.3910, lng: -75.4794 },
        title: `${incident.description} - ${incident.Destination}`,
        icon: getIncidentIcon(incident.status),
        type: 'incident' as const,
        data: incident
    }));
}

// Convert drivers to map markers (if they have location data)
export function driversToMarkers(drivers: DriverListItem[]): MapMarker[] {
    // For now, we'll use mock locations since drivers don't have location in the current data
    // In a real app, this would come from GPS tracking
    return drivers
        .filter(driver => driver.status === "Activo")
        .map((driver, index) => ({
            id: `driver-${driver.id}`,
            position: getMockDriverLocation(index),
            title: `${driver.User.Name} ${driver.User.LastName} - ${driver.Vehicle?.Plate || 'Sin vehículo'}`,
            icon: '🚚',
            type: 'driver' as const,
            data: driver
        }));
}

// Get incident icon based on status
function getIncidentIcon(status: string): string {
    switch (status) {
        case "Abierto":
            return '🔴';
        case "En Progreso":
            return '🟡';
        case "Cerrado":
            return '🟢';
        default:
            return '⚪';
    }
}

// Mock driver locations for demonstration (around Cartagena de Indias)
function getMockDriverLocation(index: number): { lat: number; lng: number } {
    const baseLocations = [
        { lat: 10.3910, lng: -75.4794 }, // Centro de Cartagena
        { lat: 10.4010, lng: -75.4694 }, // Bocagrande
        { lat: 10.3810, lng: -75.4894 }, // Getsemaní
        { lat: 10.4110, lng: -75.4594 }, // Castillogrande
        { lat: 10.3710, lng: -75.4994 }, // San Diego
    ];

    return baseLocations[index % baseLocations.length];
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get map bounds for a set of markers
export function getMapBounds(markers: MapMarker[]): {
    center: { lat: number; lng: number };
    zoom: number;
} {
    if (markers.length === 0) {
        return { center: { lat: 10.3910, lng: -75.4794 }, zoom: 13 };
    }

    const lats = markers.map(m => m.position.lat);
    const lngs = markers.map(m => m.position.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const center = {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2
    };

    // Simple zoom calculation based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 13;
    if (maxDiff > 0.1) zoom = 10;
    else if (maxDiff > 0.05) zoom = 11;
    else if (maxDiff > 0.02) zoom = 12;
    else if (maxDiff > 0.01) zoom = 13;
    else zoom = 14;

    return { center, zoom };
}
