"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { getPackageById, getOrderById } from "@/mocks/orders";

type EventStatus = "Creado" | "En Tránsito" | "Entregado";

interface DeliveryEvent {
    id: string;
    status: EventStatus;
    description: string;
    timestamp: string;
    icon: "📄" | "🚛" | "✅";
}

const STATUS_STYLES: Record<string, string> = {
    "Entregado": "bg-emerald-50 text-emerald-700",
    "En Tránsito": "bg-blue-50 text-blue-700",
    "En camino": "bg-blue-50 text-blue-700",
    "Pendiente": "bg-amber-50 text-amber-600",
};

export default function PackageDetailPage() {
    const params = useParams();
    const packageId = parseInt(params.packageId as string);

    const packageData = useMemo(() => getPackageById(packageId), [packageId]);
    const orderData = useMemo(() => {
        if (packageData) {
            return getOrderById(packageData.OrderID);
        }
        return null;
    }, [packageData]);

    // Mock delivery events based on package status
    const deliveryEvents: DeliveryEvent[] = useMemo(() => {
        if (!packageData) return [];

        const events: DeliveryEvent[] = [
            {
                id: "1",
                status: "Creado",
                description: "Paquete Creado",
                timestamp: "15 de mayo de 2024, 10:00 AM",
                icon: "📄"
            }
        ];

        if (packageData.StartStatus === "En Tránsito" || packageData.StartStatus === "Entregado" || packageData.StartStatus === "En camino") {
            events.push({
                id: "2",
                status: "En Tránsito",
                description: "En Tránsito",
                timestamp: "15 de mayo de 2024, 2:00 PM",
                icon: "🚛"
            });
        }

        if (packageData.StartStatus === "Entregado") {
            events.push({
                id: "3",
                status: "Entregado",
                description: "Entregado",
                timestamp: "16 de mayo de 2024, 11:00 AM",
                icon: "✅"
            });
        }

        return events;
    }, [packageData]);

    if (!packageData) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader eyebrow="Paquetes" title="Paquete no encontrado" />
                </div>
                <div className="text-center py-12">
                    <p className="text-slate-600">El paquete solicitado no existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Paquetes" title={`Detalle de Paquete #${packageData.id}`} />
                    <p className="text-sm text-slate-600 mt-1">
                        Orden asociada: #{packageData.OrderID} | Creado el 15 de mayo de 2024
                    </p>
                </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Detalles del Paquete</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[packageData.StartStatus] || 'bg-gray-50 text-gray-700'}`}>
                                {packageData.StartStatus}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
                            <p className="text-sm text-slate-900">
                                {orderData?.ClientName || "Distribuciones S.A."}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Dirección de Entrega</label>
                            <p className="text-sm text-slate-900">
                                {orderData?.DeliveryAddress || "Calle Principal #123, Ciudad"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Entrega</label>
                            <p className="text-sm text-slate-900">16 de mayo de 2024</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Servicio</label>
                            <p className="text-sm text-slate-900">
                                {packageData.TypePackage === "Express" ? "Express" : "Standard"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Peso Total</label>
                            <p className="text-sm text-slate-900">{packageData.Weight} kg</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Valor Declarado</label>
                            <p className="text-sm text-slate-900">
                                ${packageData.DeclaredValue.toLocaleString('es-CO')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contenido</label>
                            <p className="text-sm text-slate-900">{packageData.DescriptionContent}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Historial de Eventos</h3>

                <div className="space-y-4">
                    {deliveryEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${event.status === "Entregado" ? "bg-emerald-100" :
                                        event.status === "En Tránsito" ? "bg-blue-100" :
                                            "bg-slate-100"
                                    }`}>
                                    {event.icon}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {event.status === "Entregado" && (
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    )}
                                    {event.status === "En Tránsito" && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    )}
                                    {event.status === "Creado" && (
                                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                                    )}
                                    <p className="text-sm font-medium text-slate-900">{event.description}</p>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{event.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Proof of Delivery */}
            {packageData.StartStatus === "Entregado" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Prueba de Entrega (POD)</h3>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-slate-900 mb-2">Firma del Receptor</h4>
                                <p className="text-sm text-slate-600 mb-1">Recibido por: Carlos Pérez</p>
                                <p className="text-sm text-slate-500">Entregado el 16 de mayo de 2024 a las 11:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
