import { useState, useEffect } from "react";
import { ordersMock, type OrderListItem } from "@/mocks/orders";
import { driversMock, type DriverListItem } from "@/mocks/drivers";

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

export function useOrderTracking(orderNumber: string) {
    const [orderInfo, setOrderInfo] = useState<OrderStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderInfo = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Find order in existing mock data
                const foundOrder = ordersMock.find(order => order.id.toString() === orderNumber);
                
                if (!foundOrder) {
                    setError("Pedido no encontrado");
                    setOrderInfo(null);
                } else {
                    // Find driver information if order has a driver assigned
                    const driver = foundOrder.DriverID ? driversMock.find(d => d.id === foundOrder.DriverID) : null;
                    
                    // Map order status to client-friendly status
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

                    // Generate timeline based on order status
                    const generateTimeline = (order: OrderListItem, driver?: DriverListItem) => {
                        const timeline = [
                            {
                                timestamp: new Date(order.Create_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                                status: "Pedido confirmado",
                                description: "Tu pedido ha sido confirmado y está siendo preparado",
                                completed: true
                            }
                        ];

                        if (order.Assing_at) {
                            timeline.push({
                                timestamp: new Date(order.Assing_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                                status: "Asignado",
                                description: driver ? `Asignado al conductor ${driver.User.Name} ${driver.User.LastName}` : "Asignado a conductor",
                                completed: true
                            });
                        }

                        if (order.Status === "En camino") {
                            timeline.push({
                                timestamp: new Date(order.Assing_at || order.Create_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                                status: "En camino",
                                description: driver ? `Tu pedido está en camino con ${driver.User.Name}` : "Tu pedido está en camino",
                                completed: true
                            });
                        }

                        if (order.Status === "Entregado") {
                            timeline.push({
                                timestamp: new Date(order.ETA).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                                status: "Entregado",
                                description: "Tu pedido ha sido entregado exitosamente",
                                completed: true
                            });
                        } else {
                            timeline.push({
                                timestamp: new Date(order.ETA).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                                status: "Entrega estimada",
                                description: "Tu pedido será entregado aproximadamente a esta hora",
                                completed: false
                            });
                        }

                        return timeline;
                    };

                    // Generate mock coordinates based on delivery address
                    const generateCoordinates = (address: string) => {
                        // Simple hash function to generate consistent coordinates
                        let hash = 0;
                        for (let i = 0; i < address.length; i++) {
                            const char = address.charCodeAt(i);
                            hash = ((hash << 5) - hash) + char;
                            hash = hash & hash; // Convert to 32bit integer
                        }
                        
                        // Generate coordinates around Medellín, Colombia
                        const baseLat = 6.2442;
                        const baseLng = -75.5812;
                        const latOffset = (hash % 1000) / 10000; // Small offset
                        const lngOffset = ((hash >> 10) % 1000) / 10000;
                        
                        return {
                            lat: baseLat + latOffset,
                            lng: baseLng + lngOffset
                        };
                    };

                    const destinationCoords = generateCoordinates(foundOrder.DeliveryAddress);
                    const currentCoords = foundOrder.Status === "En camino" ? {
                        lat: destinationCoords.lat - 0.01,
                        lng: destinationCoords.lng - 0.01
                    } : undefined;

                    const orderStatus: OrderStatus = {
                        id: foundOrder.id.toString(),
                        status: mapStatus(foundOrder.Status),
                        deliveryAddress: foundOrder.DeliveryAddress,
                        estimatedTime: foundOrder.Status === "Entregado" ? "Entregado" : new Date(foundOrder.ETA).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        driverName: driver ? `${driver.User.Name} ${driver.User.LastName}` : undefined,
                        driverPhone: driver?.PhoneNumber,
                        currentLocation: currentCoords,
                        destinationLocation: destinationCoords,
                        timeline: generateTimeline(foundOrder, driver || undefined)
                    };

                    setOrderInfo(orderStatus);
                }
            } catch {
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

    // Simulate real-time location updates for in-transit orders
    useEffect(() => {
        if (!orderInfo || orderInfo.status !== "in_transit") return;

        const interval = setInterval(() => {
            setOrderInfo(prev => {
                if (!prev || !prev.currentLocation) return prev;

                // Simulate small movement towards destination
                const deltaLat = (prev.destinationLocation.lat - prev.currentLocation.lat) * 0.01;
                const deltaLng = (prev.destinationLocation.lng - prev.currentLocation.lng) * 0.01;

                return {
                    ...prev,
                    currentLocation: {
                        lat: prev.currentLocation.lat + deltaLat,
                        lng: prev.currentLocation.lng + deltaLng
                    }
                };
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [orderInfo?.status]);

    return {
        orderInfo,
        isLoading,
        error,
        refetch: () => {
            if (orderNumber) {
                setIsLoading(true);
                // Re-trigger the effect
                setOrderInfo(null);
            }
        }
    };
}
