import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface OrderStatus {
    id: string;
    status: "pending" | "in_transit" | "delivered" | "cancelled";
    deliveryAddress: string;
    estimatedTime: string;
    driverName?: string;
    driverPhone?: string;
    currentLocation?: {
        lat: number;
        lng: number;
    };
    destinationLocation: {
        lat: number;
        lng: number;
    };
    timeline: {
        timestamp: string;
        status: string;
        description: string;
        completed: boolean;
    }[];
}

interface TrackData {
    track_id: number;
    order_id: number;
    latitude: number;
    longitude: number;
    timestamp: string;
}

interface APIResponse {
    order_id: number;
    status: string;
    tracks: TrackData[];
}

export function useOrderTracking(orderNumber: string) {
    const [orderInfo, setOrderInfo] = useState<OrderStatus | null>(null);
    const [trackHistory, setTrackHistory] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderInfo = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Call public tracking API
                const response = await fetch(`${API_URL}/public/tracking/${orderNumber}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Pedido no encontrado");
                    } else {
                        setError("Error al cargar la información del pedido");
                    }
                    setOrderInfo(null);
                    return;
                }

                const { data } = await response.json() as { data: APIResponse };

                // Map backend status to frontend status
                const mapStatus = (status: string): "pending" | "in_transit" | "delivered" | "cancelled" => {
                    switch (status.toLowerCase()) {
                        case "pendiente":
                            return "pending";
                        case "en camino":
                            return "in_transit";
                        case "entregado":
                            return "delivered";
                        case "cancelado":
                            return "cancelled";
                        default:
                            return "pending";
                    }
                };

                // Get latest track (current location)
                const latestTrack = data.tracks.length > 0 ? data.tracks[0] : null;

                // Get destination (could be from order data or use last track)
                // For now, use a fixed location or the latest track
                const destinationCoords = latestTrack ? {
                    lat: latestTrack.latitude,
                    lng: latestTrack.longitude
                } : {
                    lat: 6.2442,
                    lng: -75.5812
                };

                // Current location (slightly offset for in-transit orders)
                const currentCoords = data.status.toLowerCase() === "en camino" && latestTrack ? {
                    lat: latestTrack.latitude,
                    lng: latestTrack.longitude
                } : undefined;

                // Generate timeline from tracks
                const generateTimeline = (tracks: TrackData[], status: string) => {
                    const timeline = [];

                    // Add initial confirmation
                    if (tracks.length > 0) {
                        const firstTrack = tracks[tracks.length - 1];
                        timeline.push({
                            timestamp: new Date(firstTrack.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            status: "Pedido confirmado",
                            description: "Tu pedido ha sido confirmado y está siendo preparado",
                            completed: true
                        });
                    }

                    // Add in-transit status
                    if (status.toLowerCase() === "en camino" && tracks.length > 0) {
                        timeline.push({
                            timestamp: new Date(tracks[0].timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            status: "En camino",
                            description: "Tu pedido está en camino",
                            completed: true
                        });
                    }

                    // Add delivery status
                    if (status.toLowerCase() === "entregado") {
                        timeline.push({
                            timestamp: new Date(tracks[0].timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            status: "Entregado",
                            description: "Tu pedido ha sido entregado exitosamente",
                            completed: true
                        });
                    } else {
                        // Estimated delivery
                        const estimatedTime = new Date();
                        estimatedTime.setMinutes(estimatedTime.getMinutes() + 30); // 30 min estimate
                        timeline.push({
                            timestamp: estimatedTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            status: "Entrega estimada",
                            description: "Tu pedido será entregado aproximadamente a esta hora",
                            completed: false
                        });
                    }

                    return timeline;
                };

                const orderStatus: OrderStatus = {
                    id: data.order_id.toString(),
                    status: mapStatus(data.status),
                    deliveryAddress: "Dirección de entrega", // TODO: Get from order data
                    estimatedTime: data.status.toLowerCase() === "entregado" ? "Entregado" : "30 min",
                    currentLocation: currentCoords,
                    destinationLocation: destinationCoords,
                    timeline: generateTimeline(data.tracks, data.status)
                };

                // Map tracks to route path (ordenados del más antiguo al más reciente)
                const routeHistory = data.tracks
                    .slice()
                    .reverse() // Invertir para tener del más antiguo al más reciente
                    .map(track => ({
                        lat: track.latitude,
                        lng: track.longitude
                    }));

                setOrderInfo(orderStatus);
                setTrackHistory(routeHistory);
            } catch (err) {
                console.error("Error fetching tracking:", err);
                setError("Error al cargar la información del pedido");
                setOrderInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (orderNumber) {
            fetchOrderInfo();
        }
    }, [orderNumber]);

    return {
        orderInfo,
        trackHistory,
        isLoading,
        error,
        refetch: () => {
            if (orderNumber) {
                setIsLoading(true);
                setOrderInfo(null);
                setTrackHistory([]);
            }
        }
    };
}
