import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "@/modules/shared/hooks/useWebSocket";

interface TrackUpdate {
    order_id: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    track_id: number;
}

interface DriverLocation {
    orderId: number;
    driverId?: number;
    driverName?: string;
    location: {
        lat: number;
        lng: number;
    };
    timestamp: string;
    status?: string;
}

export function useAdminTracking() {
    const [driversLocations, setDriversLocations] = useState<Map<number, DriverLocation>>(new Map());
    const [activeOrders, setActiveOrders] = useState<number[]>([]);

    // WebSocket callbacks
    const handleWebSocketOpen = useCallback((ws: WebSocket) => {
        console.log('🔌 Admin WebSocket conectado');
        // Suscribirse como admin para recibir TODAS las actualizaciones
        ws.send(JSON.stringify({
            type: 'subscribe',
            role: 'admin'
        }));
        console.log('📡 Admin suscrito a todas las actualizaciones');
    }, []);

    const handleWebSocketMessage = useCallback((message: { type: string; payload: unknown }) => {
        console.log('📨 Admin recibió mensaje:', message);

        if (message.type === 'track_update') {
            const payload = message.payload as TrackUpdate;
            console.log('🚚 Actualización de ubicación:', payload);

            // Actualizar ubicación del conductor para esta orden
            setDriversLocations(prev => {
                const newMap = new Map(prev);
                newMap.set(payload.order_id, {
                    orderId: payload.order_id,
                    location: {
                        lat: payload.latitude,
                        lng: payload.longitude
                    },
                    timestamp: payload.timestamp
                });
                return newMap;
            });

            // Agregar a órdenes activas si no existe
            setActiveOrders(prev => {
                if (!prev.includes(payload.order_id)) {
                    return [...prev, payload.order_id];
                }
                return prev;
            });
        }
    }, []);

    // Conectar WebSocket
    const { isConnected } = useWebSocket({
        onOpen: handleWebSocketOpen,
        onMessage: handleWebSocketMessage,
        reconnect: true,
        maxReconnectAttempts: 5
    });

    // Cargar órdenes activas iniciales desde la API
    useEffect(() => {
        const fetchActiveOrders = async () => {
            try {
                // TODO: Llamar a la API para obtener todas las órdenes activas
                // Por ahora usamos las que sabemos que existen
                const orderIds = [1, 2, 4, 8]; // Órdenes activas del seed

                // Fetch tracking data for each order
                const locationsPromises = orderIds.map(async (orderId) => {
                    try {
                        const response = await fetch(`http://localhost:8000/api/v1/public/tracking/${orderId}`);
                        if (response.ok) {
                            const { data } = await response.json();
                            if (data.tracks && data.tracks.length > 0) {
                                const latestTrack = data.tracks[0]; // El más reciente
                                return {
                                    orderId: data.order_id,
                                    location: {
                                        lat: latestTrack.latitude,
                                        lng: latestTrack.longitude
                                    },
                                    timestamp: latestTrack.timestamp,
                                    status: data.status
                                };
                            }
                        }
                    } catch (err) {
                        console.error(`Error fetching order ${orderId}:`, err);
                    }
                    return null;
                });

                const locations = await Promise.all(locationsPromises);

                // Inicializar mapa de ubicaciones
                const locationsMap = new Map<number, DriverLocation>();
                locations.forEach(loc => {
                    if (loc !== null) {
                        locationsMap.set(loc.orderId, loc);
                    }
                });

                setDriversLocations(locationsMap);
                setActiveOrders(orderIds);
            } catch (error) {
                console.error('Error cargando órdenes activas:', error);
            }
        };

        fetchActiveOrders();
    }, []);

    return {
        driversLocations: Array.from(driversLocations.values()),
        activeOrders,
        isConnected
    };
}
