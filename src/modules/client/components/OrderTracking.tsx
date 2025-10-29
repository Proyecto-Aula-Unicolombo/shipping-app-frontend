"use client";

import { useRouter, useParams } from "next/navigation";
import { GoogleMap } from "@/modules/shared/components/GoogleMap";
import { Button } from "@/modules/shared/ui/Button";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useOrderTracking } from "../hooks/useOrderTracking";
import {
    FiTruck,
    FiMapPin,
    FiClock,
    FiPhone,
    FiMessageCircle,
    FiNavigation
} from "react-icons/fi";

export function OrderTracking() {
    const router = useRouter();
    const params = useParams();
    const orderNumber = params.orderNumber as string;
    const { orderInfo, isLoading, error } = useOrderTracking(orderNumber);

    const getStatusInfo = (status: "pending" | "in_transit" | "delivered" | "cancelled") => {
        switch (status) {
            case "pending":
                return {
                    text: "Preparando pedido",
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
        if (!orderInfo) return [];

        const markers = [];

        // Destination marker
        markers.push({
            id: "destination",
            position: {
                lat: orderInfo.destinationLocation.lat,
                lng: orderInfo.destinationLocation.lng
            },
            title: "Destino",
            icon: "🏠"
        });

        // Driver location marker (if in transit)
        if (orderInfo.status === "in_transit" && orderInfo.currentLocation) {
            markers.push({
                id: "driver",
                position: {
                    lat: orderInfo.currentLocation.lat,
                    lng: orderInfo.currentLocation.lng
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
                    <p className="text-slate-600">Cargando información del pedido...</p>
                </div>
            </div>
        );
    }

    if (error || !orderInfo) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiTruck size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        {error || "Pedido no encontrado"}
                    </h2>
                    <p className="text-slate-600 mb-6">
                        {error ? "Hubo un problema al cargar la información" : `No pudimos encontrar un pedido con el número ${orderNumber}`}
                    </p>
                    <Button
                        onClick={() => router.push(ROUTES.client.tracking)}
                        variant="secondary"
                    >
                        Buscar otro pedido
                    </Button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(orderInfo.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col min-h-screen">
                {/* Map */}
                <div className="h-[30rem] relative">
                    <GoogleMap
                        center={orderInfo.currentLocation || orderInfo.destinationLocation}
                        zoom={13}
                        markers={getMapMarkers()}
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

                {/* Order Info */}
                <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 space-y-6">
                    {/* Status */}
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon size={16} className={statusInfo.color} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiTruck size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Pedido #{orderInfo.id}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {statusInfo.text}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={16} className="text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Dirección de entrega
                                </p>
                                <p className="text-sm text-slate-600">
                                    {orderInfo.deliveryAddress}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiClock size={16} className="text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Tiempo estimado
                                </p>
                                <p className="text-sm text-slate-600">
                                    Entrega estimada: {orderInfo.estimatedTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Driver Contact (only if in transit) */}
                    {orderInfo.status === "in_transit" && orderInfo.driverName && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-medium text-slate-900 mb-3">
                                Información del conductor
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {orderInfo.driverName}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Conductor asignado
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                                        <FiPhone size={16} className="text-green-600" />
                                    </button>
                                    <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                                        <FiMessageCircle size={16} className="text-blue-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Driver Button */}
                    {orderInfo.status === "in_transit" && (
                        <Button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
                            Contactar al conductor
                        </Button>
                    )}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex min-h-screen max-w-7xl mx-auto">
                {/* Left Panel - Order Info */}
                <div className="w-96 bg-white shadow-lg p-8 space-y-6 overflow-y-auto">
                    {/* Status */}
                    <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon size={20} className={statusInfo.color} />
                        <span className={`text-base font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiTruck size={18} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-lg">
                                    Pedido #{orderInfo.id}
                                </p>
                                <p className="text-slate-600">
                                    {statusInfo.text}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiMapPin size={18} className="text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                    Dirección de entrega
                                </p>
                                <p className="text-slate-600">
                                    {orderInfo.deliveryAddress}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <FiClock size={18} className="text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                    Tiempo estimado
                                </p>
                                <p className="text-slate-600">
                                    Entrega estimada: {orderInfo.estimatedTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Driver Contact (only if in transit) */}
                    {orderInfo.status === "in_transit" && orderInfo.driverName && (
                        <div className="bg-slate-50 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">
                                Información del conductor
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {orderInfo.driverName}
                                    </p>
                                    <p className="text-slate-600">
                                        Conductor asignado
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                                        <FiPhone size={18} className="text-green-600" />
                                    </button>
                                    <button className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                                        <FiMessageCircle size={18} className="text-blue-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Driver Button */}
                    {orderInfo.status === "in_transit" && (
                        <Button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg">
                            Contactar al conductor
                        </Button>
                    )}
                </div>

                {/* Right Panel - Map */}
                <div className="flex-1 relative">
                    <GoogleMap
                        center={orderInfo.currentLocation || orderInfo.destinationLocation}
                        zoom={13}
                        markers={getMapMarkers()}
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
