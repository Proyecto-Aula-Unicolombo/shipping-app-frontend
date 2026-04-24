import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface PackageInfo {
    packageId: number;
    numPackage: string;
    status: "pending" | "in_transit" | "delivered" | "cancelled";
    origin: string;
    destination: string;
    receiverName: string;
    isFragile: boolean;
    weight?: number;
    currentLocation?: {
        lat: number;
        lng: number;
    };
    destinationLocation: {
        lat: number;
        lng: number;
    };
}

interface LocationInfo {
    latitude: number;
    longitude: number;
    timestamp: string;
}

interface TrackPackageAPIResponse {
    package_id: number;
    num_package: string;
    status: string;
    origin: string;
    destination: string;
    current_location: LocationInfo | null;
    receiver_name: string;
    receiver_phone: string;
    is_fragile: boolean;
    weight: number | null;
    tracking_history: LocationInfo[];
}

export function usePackageTracking(num_package: string) {
    const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
    const [trackHistory, setTrackHistory] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackageInfo = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log("Num package:", num_package);
                const response = await fetch(`${API_URL}/public/tracking/${num_package}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Paquete no encontrado");
                    } else {
                        setError("Error al cargar la información del paquete");
                    }
                    setPackageInfo(null);
                    return;
                }

                const { data } = await response.json() as { data: TrackPackageAPIResponse };

                // Map backend status to frontend status
                const mapStatus = (status: string): "pending" | "in_transit" | "delivered" | "cancelled" => {
                    switch (status.toLowerCase()) {
                        case "pendiente":
                            return "pending";
                        case "en camino":
                        case "in_transit":
                            return "in_transit";
                        case "entregado":
                        case "delivered":
                            return "delivered";
                        case "cancelado":
                        case "cancelled":
                            return "cancelled";
                        default:
                            return "pending";
                    }
                };

                // Current location from API
                const currentCoords = data.current_location ? {
                    lat: data.current_location.latitude,
                    lng: data.current_location.longitude
                } : undefined;

                // Destination location: use last tracking point or a default
                const destinationCoords = currentCoords || {
                    lat: 10.3910,
                    lng: -75.5146
                };

                const pkgInfo: PackageInfo = {
                    packageId: data.package_id,
                    numPackage: data.num_package,
                    status: mapStatus(data.status),
                    origin: data.origin || "Origen no disponible",
                    destination: data.destination || "Destino no disponible",
                    receiverName: data.receiver_name || "",
                    isFragile: data.is_fragile,
                    weight: data.weight ?? undefined,
                    currentLocation: currentCoords,
                    destinationLocation: destinationCoords,
                };

                // Map tracking history to route path (oldest to newest for drawing the route)
                const routeHistory = (data.tracking_history || [])
                    .slice()
                    .reverse()
                    .map(loc => ({
                        lat: loc.latitude,
                        lng: loc.longitude
                    }));

                setPackageInfo(pkgInfo);
                setTrackHistory(routeHistory);
            } catch (err) {
                console.error("Error fetching package tracking:", err);
                setError("Error al cargar la información del paquete");
                setPackageInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (num_package) {
            fetchPackageInfo();
        }
    }, [num_package]);

    return {
        packageInfo,
        trackHistory,
        isLoading,
        error,
        refetch: () => {
            if (num_package) {
                setIsLoading(true);
                setPackageInfo(null);
                setTrackHistory([]);
            }
        }
    };
}
