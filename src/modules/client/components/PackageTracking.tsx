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
    FiPackage,
    FiAlertTriangle,
    FiArrowLeft
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



    // WebSocket message handler
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
        } else if (message.type === 'connected') {
            console.log('✅ Mensaje de bienvenida del servidor');
        }
    }, []);

    // WebSocket connection for real-time updates
    const { isConnected, sendRaw } = useWebSocket({
        onMessage: handleWebSocketMessage,
        reconnect: true,
        maxReconnectAttempts: 3
    });

    // Subscribe to WebSocket updates once connected AND packageInfo is loaded
    useEffect(() => {
        if (isConnected && packageInfo) {
            console.log('🔌 Subscribing to package tracking with packageId:', packageInfo.packageId);
            sendRaw({
                type: 'subscribe',
                role: 'client',
                order_ids: [packageInfo.packageId]
            });
        }
    }, [isConnected, packageInfo, sendRaw]);

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
                        center={currentDriverLocation || { lat: 10.3910, lng: -75.5146 }}
                        zoom={14}
                        markers={getMapMarkers()}
                        className="w-full h-full"
                    />
                </div>

                {/* Package Info */}
                <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 space-y-6">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push(ROUTES.client.tracking)}
                            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
                        >
                            <FiArrowLeft size={18} />
                            Volver
                        </button>
                    </div>

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
                    {/* Back Button */}
                    <button
                        onClick={() => router.push(ROUTES.client.tracking)}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium mb-2"
                    >
                        <FiArrowLeft size={20} />
                        Volver a buscar
                    </button>

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
                        center={currentDriverLocation || { lat: 10.3910, lng: -75.5146 }}
                        zoom={14}
                        markers={getMapMarkers()}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
