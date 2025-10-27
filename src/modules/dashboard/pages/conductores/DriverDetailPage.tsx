"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import { useOrderQueryStore } from "../../orders/hooks/useOrderQueryStore";
import type { DriverDetail } from "@/mocks/drivers";
import type { OrderListItem } from "@/mocks/orders";
import { BackButton } from "../../components/BackButton";

type DriverDetailPageProps = {
    driver: DriverDetail;
};

const STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700",
    Inactivo: "bg-amber-50 text-amber-600",
} as const;

export function DriverDetailPage({ driver: initialDriver }: DriverDetailPageProps) {
    const { drivers, updateDriverStatusAsync, isUpdatingStatus, updateStatusError } = useDriverQueryStore();
    
    // Get the current driver from the store to ensure we have the latest status
    const driver = useMemo(() => {
        const currentDriver = drivers.find(d => d.id === initialDriver.id);
        return currentDriver ? { ...initialDriver, status: currentDriver.status } : initialDriver;
    }, [drivers, initialDriver]);
    
    const avatarUrl = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * 90);
        return `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;
    }, []);

    const handleStatusToggle = useCallback(async () => {
        const newStatus = driver.status === "Activo" ? "Inactivo" : "Activo";
        try {
            await updateDriverStatusAsync({ id: driver.id, status: newStatus });
        } catch (error) {
            console.error("Failed to update driver status:", error);
        }
    }, [driver.id, driver.status, updateDriverStatusAsync]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Conductores"
                    title="Detalles del Conductor"
                    description="Vea la información del conductor y el vehículo asignado."
                />
            </div>

            <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 md:flex-row md:items-start">
                <div className="flex flex-col items-center gap-4 text-center md:w-60 md:text-left">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border border-slate-200">
                        <Image
                            src={avatarUrl}
                            alt={`Avatar de ${driver.User.Name} ${driver.User.LastName}`}
                            fill
                            sizes="128px"
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {driver.User.Name} {driver.User.LastName}
                        </h2>
                        <p className="text-sm text-slate-500">ID del Conductor: {driver.id}</p>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[driver.status]}`}
                            >
                                {driver.status}
                            </span>
                            <Button
                                variant={driver.status === "Activo" ? "secondary" : "primary"}
                                onClick={handleStatusToggle}
                                disabled={isUpdatingStatus}
                                className="text-xs px-3 py-1"
                            >
                                {isUpdatingStatus 
                                    ? "Actualizando..." 
                                    : driver.status === "Activo" 
                                        ? "Desactivar" 
                                        : "Activar"
                                }
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Información del Conductor</h3>
                        <div className="grid gap-6 rounded-xl border border-slate-200 p-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Número de Teléfono
                                </p>
                                <p className="text-sm text-slate-700">{driver.PhoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Licencia</p>
                                <p className="text-sm text-slate-700">{driver.License}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Correo Electrónico
                                </p>
                                <p className="text-sm text-slate-700">{driver.User.Email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Dirección
                                </p>
                                <p className="text-sm text-slate-700">{driver.Address}</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Asignaciones de Vehículos</h3>
                        </div>
                        
                        <div className="rounded-xl border border-slate-200 p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">
                                Los vehículos ahora se asignan a través de las órdenes de entrega
                            </p>
                            <p className="text-xs text-slate-500">
                                Para ver las asignaciones de vehículos de este conductor, revise las{" "}
                                <span className="font-medium text-slate-700">Órdenes Asignadas</span> más abajo
                            </p>
                        </div>
                    </section>

                    {/* Assigned Orders Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Órdenes Asignadas</h3>
                        <AssignedOrdersList driverId={driver.id} />
                    </section>
                </div>
            </section>

            {/* Error Display */}
            {updateStatusError && (
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        Error al actualizar estado: {updateStatusError instanceof Error ? updateStatusError.message : "Error desconocido"}
                    </p>
                </div>
            )}
        </div>
    );
}

// Component to show assigned orders for a driver
function AssignedOrdersList({ driverId }: { driverId: number }) {
    const { getOrdersByDriverId } = useOrderQueryStore();
    
    const assignedOrders = useMemo(() => {
        return getOrdersByDriverId(driverId);
    }, [driverId, getOrdersByDriverId]);

    if (assignedOrders.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 p-6 text-center">
                <p className="text-sm text-slate-500">No hay órdenes asignadas a este conductor</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {assignedOrders.map((order: OrderListItem) => (
                <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-slate-900">Orden #{order.id}</p>
                            <p className="text-sm text-slate-600">{order.ClientName}</p>
                            <p className="text-xs text-slate-500">{order.DeliveryAddress}</p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                order.Status === "Entregado" 
                                    ? "bg-emerald-50 text-emerald-700"
                                    : order.Status === "En camino"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-600"
                            }`}>
                                {order.Status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
