"use client";

import { useState } from "react";
import { GoogleMap } from "@/modules/shared/components/GoogleMap";
import { useAdminTracking } from "../hooks/useAdminTracking";
import {
    FiTruck,
    FiMapPin,
    FiClock,
    FiActivity,
    FiRefreshCw
} from "react-icons/fi";

export function RealTimeTracking() {
    const { driversLocations, activeOrders, isConnected } = useAdminTracking();
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    // Calcular centro del mapa basado en todas las ubicaciones
    const getMapCenter = () => {
        if (driversLocations.length === 0) {
            // Default: Cartagena, Colombia
            return { lat: 10.3910, lng: -75.4794 };
        }

        const avgLat = driversLocations.reduce((sum, loc) => sum + loc.location.lat, 0) / driversLocations.length;
        const avgLng = driversLocations.reduce((sum, loc) => sum + loc.location.lng, 0) / driversLocations.length;

        return { lat: avgLat, lng: avgLng };
    };

    // Crear marcadores para el mapa
    const mapMarkers = driversLocations.map(driver => ({
        id: `order-${driver.orderId}`,
        position: driver.location,
        icon: '🚚',
        label: `#${driver.orderId}`,
        onClick: () => setSelectedOrder(driver.orderId)
    }));

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'en camino':
                return 'bg-blue-100 text-blue-700';
            case 'entregado':
                return 'bg-green-100 text-green-700';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelado':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con estado de conexión */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Seguimiento en Tiempo Real</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Monitoreo de todos los conductores activos
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100">
                        <FiActivity className={`${isConnected ? 'text-green-600' : 'text-red-600'} animate-pulse`} />
                        <span className="text-sm font-medium text-slate-700">
                            {isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                        <FiTruck className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                            {driversLocations.length} conductores activos
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel lateral - Lista de conductores */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FiTruck className="text-blue-600" />
                            Conductores Activos
                        </h2>

                        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {driversLocations.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiMapPin className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                    <p className="text-slate-500 text-sm">
                                        No hay conductores activos
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Las ubicaciones aparecerán aquí en tiempo real
                                    </p>
                                </div>
                            ) : (
                                driversLocations.map(driver => (
                                    <div
                                        key={driver.orderId}
                                        onClick={() => setSelectedOrder(driver.orderId)}
                                        className={`
                                            p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${selectedOrder === driver.orderId
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-blue-300 bg-white'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-blue-100">
                                                    <FiTruck className="text-blue-600" size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        Orden #{driver.orderId}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {driver.driverName || 'Conductor'}
                                                    </p>
                                                </div>
                                            </div>
                                            {driver.status && (
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(driver.status)}`}>
                                                    {driver.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-xs text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <FiMapPin size={12} className="text-slate-400" />
                                                <span>
                                                    {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiClock size={12} className="text-slate-400" />
                                                <span>
                                                    Actualizado: {formatTimestamp(driver.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="h-[calc(100vh-200px)] relative">
                            <GoogleMap
                                center={getMapCenter()}
                                zoom={driversLocations.length > 0 ? 13 : 12}
                                markers={mapMarkers}
                                className="w-full h-full"
                            />

                            {/* Overlay de información */}
                            <div className="absolute top-4 left-4 right-4 pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 pointer-events-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                                <span className="text-sm font-medium text-slate-700">
                                                    En tiempo real
                                                </span>
                                            </div>
                                            <div className="h-4 w-px bg-slate-300"></div>
                                            <span className="text-sm text-slate-600">
                                                {activeOrders.length} órdenes en tránsito
                                            </span>
                                        </div>

                                        {driversLocations.length > 0 && (
                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                <FiRefreshCw size={14} />
                                                Ver todos
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Leyenda */}
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3">
                                <p className="text-xs font-semibold text-slate-700 mb-2">Leyenda</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🚚</span>
                                        <span className="text-xs text-slate-600">Conductor activo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
