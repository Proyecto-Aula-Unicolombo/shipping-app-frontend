import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "@/modules/shared/hooks/useWebSocket";
import { useIncidentsQuery } from "@/modules/dashboard/incidents/hooks/useIncidentsQuery";
import { api } from "@/lib/apiClient";

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

export function useAdminTracking(selectedOrderId?: number) {
    const [driversLocations, setDriversLocations] = useState<Map<number, DriverLocation>>(new Map());
    const [activeOrders, setActiveOrders] = useState<number[]>([]);

    // Fetch incidents for selected order
    const { incidents } = useIncidentsQuery({
        listParams: selectedOrderId ? { order_id: selectedOrderId } : undefined,
    });

    // Get last 3 incidents for selected order
    const recentIncidents = selectedOrderId
        ? incidents.slice(0, 3)
        : [];

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
                // Llamar al endpoint de admin que devuelve todas las órdenes activas
                const response = await api.get('/admin/tracking/active-orders');

                const { data } = response.data;

                // Inicializar mapa de ubicaciones
                const locationsMap = new Map<number, DriverLocation>();
                const orderIds: number[] = [];

                data.forEach((order: {
                    order_id: number;
                    driver_id?: number;
                    driver_name?: string;
                    latitude?: number;
                    longitude?: number;
                    timestamp?: string;
                    status: string;
                }) => {
                    // Solo agregar si tiene ubicación
                    if (order.latitude && order.longitude) {
                        locationsMap.set(order.order_id, {
                            orderId: order.order_id,
                            driverId: order.driver_id,
                            driverName: order.driver_name,
                            location: {
                                lat: order.latitude,
                                lng: order.longitude
                            },
                            timestamp: order.timestamp || new Date().toISOString(),
                            status: order.status
                        });
                        orderIds.push(order.order_id);
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
        isConnected,
        recentIncidents
    };
}
