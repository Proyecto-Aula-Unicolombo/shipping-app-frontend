"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GoogleMap } from "@/modules/shared/components/GoogleMap";
import { Button } from "@/modules/shared/ui/Button";
import { ROUTES } from "@/modules/shared/constants/routes";
import { usePackageTracking } from "../hooks/usePackageTracking";
import { useWebSocket } from "@/modules/shared/hooks/useWebSocket";
import {
    FiTruck,
    FiMapPin,
    FiClock,
    FiPhone,
    FiMessageCircle,
    FiNavigation,
    FiPackage,
    FiAlertTriangle
} from "react-icons/fi";

interface TrackUpdate {
    order_id: number;
    track_id: number;
    latitude: number;
    longitude: number;
    timestamp: string;
}

export function PackageTracking() {
    const router = useRouter();
    const params = useParams();
    const numPackage = params.orderNumber as string;
    const { packageInfo, trackHistory, isLoading, error } = usePackageTracking(numPackage);

    // Real-time location state
    const [realtimeLocation, setRealtimeLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Route path history (todas las ubicaciones del recorrido)
    // Inicializar con el historial de la API y agregar nuevas ubicaciones en tiempo real
    const [routePath, setRoutePath] = useState<Array<{ lat: number; lng: number }>>([]);

    // Sincronizar routePath con trackHistory cuando cambie
    useEffect(() => {
        if (trackHistory.length > 0) {
            setRoutePath(trackHistory);
        }
    }, [trackHistory]);

    // Memoize WebSocket callbacks to prevent reconnection loops
    const handleWebSocketOpen = useCallback((ws: WebSocket) => {
        console.log('🔌 WebSocket connected for package tracking');
        // Subscribe to updates - the backend still uses order_ids for the WS subscription
        ws.send(JSON.stringify({
            type: 'subscribe',
            role: 'client',
            order_ids: [parseInt(numPackage, 10)]
        }));
    }, [numPackage]);

    const handleWebSocketMessage = useCallback((message: { type: string; payload: unknown }) => {
        console.log('📨 WebSocket message recibido:', message);
        if (message.type === 'track_update') {
            const payload = message.payload as TrackUpdate;
            console.log('🔍 Track update recibido:', payload);

            const newLocation = {
                lat: payload.latitude,
                lng: payload.longitude
            };
            setRealtimeLocation(newLocation);

            // Agregar nueva ubicación al recorrido
            setRoutePath(prev => {
                const newPath = [...prev, newLocation];
                console.log('🛣️  Ruta actualizada. Total puntos:', newPath.length);
                return newPath;
            });
        } else if (message.type === 'connected') {
            console.log('✅ Mensaje de bienvenida del servidor');
        }
    }, []);

    // WebSocket connection for real-time updates
    const { isConnected, lastMessage } = useWebSocket({
        onOpen: handleWebSocketOpen,
        onMessage: handleWebSocketMessage,
        reconnect: true,
        maxReconnectAttempts: 3
    });

    // Use realtime location if available, otherwise use packageInfo location
    const currentDriverLocation = realtimeLocation || packageInfo?.currentLocation;

    const getStatusInfo = (status: "pending" | "in_transit" | "delivered" | "cancelled") => {
        switch (status) {
            case "pending":
                return {
                    text: "Preparando paquete",
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50",
                    icon: FiClock
                };
            case "in_transit":
                return {
                    text: "En camino",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    icon: FiTruck
                };
            case "delivered":
                return {
                    text: "Entregado",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    icon: FiMapPin
                };
            case "cancelled":
                return {
                    text: "Cancelado",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    icon: FiClock
                };
            default:
                return {
                    text: "Desconocido",
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    icon: FiClock
                };
        }
    };

    const getMapMarkers = () => {
        if (!packageInfo) return [];

        const markers = [];

        // Destination marker
        markers.push({
            id: "destination",
            position: {
                lat: packageInfo.destinationLocation.lat,
                lng: packageInfo.destinationLocation.lng
            },
            title: "Destino",
            icon: "🏠"
        });

        // Driver location marker (if in transit) - Use realtime location if available
        if (packageInfo.status === "in_transit" && currentDriverLocation) {
            markers.push({
                id: "driver",
                position: {
                    lat: currentDriverLocation.lat,
                    lng: currentDriverLocation.lng
                },
                title: "Conductor",
                icon: "🚚"
            });
        }

        return markers;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Cargando información del paquete...</p>
                </div>
            </div>
        );
    }

    if (error || !packageInfo) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        {error || "Paquete no encontrado"}
                    </h2>
                    <p className="text-slate-600 mb-6">
                        {error ? "Hubo un problema al cargar la información" : `No pudimos encontrar un paquete con el número ${numPackage}`}
                    </p>
                    <Button
                        onClick={() => router.push(ROUTES.client.tracking)}
                        variant="secondary"
                    >
                        Buscar otro paquete
                    </Button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(packageInfo.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col min-h-screen">
                {/* Map */}
                <div className="h-[30rem] relative">
                    <GoogleMap
                        center={currentDriverLocation || packageInfo.destinationLocation}
                        zoom={14}
                        markers={getMapMarkers()}
                        routePath={routePath}
                        className="w-full h-full"
                    />

                    {/* Search overlay */}
                    <div className="absolute top-4 left-4 right-4">
                        <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2">
                            <FiNavigation size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar ubicación..."
                                className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Map controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="text-lg font-semibold text-slate-600">+</span>
                        </button>
                        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="text-lg font-semibold text-slate-600">-</span>
                        </button>
                    </div>

                    {/* Location button */}
                    <div className="absolute bottom-4 left-4">
                        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <FiNavigation size={16} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Package Info */}
                <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 space-y-6">
                    {/* Status */}
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon size={16} className={statusInfo.color} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiPackage size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Paquete #{packageInfo.numPackage}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {statusInfo.text}
                                </p>
                                {packageInfo.isFragile && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <FiAlertTriangle size={12} className="text-orange-500" />
                                        <span className="text-xs text-orange-600 font-medium">Frágil</span>
                                    </div>
                                )}
                                {packageInfo.weight && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Peso: {packageInfo.weight} kg
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">Origen</p>
                                <p className="text-sm text-slate-600">{packageInfo.origin}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={16} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">Destino</p>
                                <p className="text-sm text-slate-600">{packageInfo.destination}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    {packageInfo.receiverName && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-medium text-slate-900 mb-3">
                                Destinatario
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {packageInfo.receiverName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex min-h-screen max-w-7xl mx-auto">
                {/* Left Panel - Package Info */}
                <div className="w-96 bg-white shadow-lg p-8 space-y-6 overflow-y-auto">
                    {/* Status */}
                    <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon size={20} className={statusInfo.color} />
                        <span className={`text-base font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiPackage size={18} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-lg">
                                    Paquete #{packageInfo.numPackage}
                                </p>
                                <p className="text-slate-600">
                                    {statusInfo.text}
                                </p>
                                {packageInfo.isFragile && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <FiAlertTriangle size={14} className="text-orange-500" />
                                        <span className="text-sm text-orange-600 font-medium">Frágil</span>
                                    </div>
                                )}
                                {packageInfo.weight && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        Peso: {packageInfo.weight} kg
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={18} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">Origen</p>
                                <p className="text-slate-600">{packageInfo.origin}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={18} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">Destino</p>
                                <p className="text-slate-600">{packageInfo.destination}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    {packageInfo.receiverName && (
                        <div className="bg-slate-50 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">
                                Destinatario
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {packageInfo.receiverName}
                                    </p>

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Map */}
                <div className="flex-1 relative">
                    <GoogleMap
                        center={currentDriverLocation || packageInfo.destinationLocation}
                        zoom={14}
                        markers={getMapMarkers()}
                        routePath={routePath}
                        className="w-full h-full"
                    />

                    {/* Search overlay */}
                    <div className="absolute top-6 left-6 right-6">
                        <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 max-w-md">
                            <FiNavigation size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar ubicación..."
                                className="flex-1 bg-transparent text-slate-600 placeholder-slate-400 outline-none"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Map controls */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                        <button className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="text-xl font-semibold text-slate-600">+</span>
                        </button>
                        <button className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="text-xl font-semibold text-slate-600">−</span>
                        </button>
                    </div>

                    {/* Location button */}
                    <div className="absolute bottom-6 left-6">
                        <button className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <FiNavigation size={18} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
