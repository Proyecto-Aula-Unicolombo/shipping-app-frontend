"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import { BackButton } from "../../components/BackButton";
import { DriverDetail } from "@/types/drivers";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/modules/shared/constants/routes";

type DriverDetailPageProps = {
    driver: DriverDetail;
};

const STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700",
    Inactivo: "bg-amber-50 text-amber-600",
} as const;

export function DriverDetailPage({ driver: initialDriver }: DriverDetailPageProps) {
    const { updateStatusDriverAsync, isUpdatingStatus, updateStatusError } = useDriverQueryStore();
    const router = useRouter();

    const avatarUrl = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * 90);
        return `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;
    }, []);

    const handleStatusToggle = useCallback(async () => {
        const newStatus = !initialDriver.IsActive; try {
            await updateStatusDriverAsync({ id: initialDriver.ID, status: newStatus });
            router.push(ROUTES.dashboard.drivers);
        } catch (error) {
            console.error("Failed to update driver status:", error);
        }
    }, [initialDriver.ID, initialDriver.IsActive, updateStatusDriverAsync]);

    const statusText = initialDriver.IsActive ? "Activo" : "Inactivo";


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
                            alt={`Avatar de ${initialDriver.Name} ${initialDriver.LastName}`}
                            fill
                            sizes="128px"
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {initialDriver.Name} {initialDriver.LastName}
                        </h2>
                        <p className="text-sm text-slate-500">ID del Conductor: {initialDriver.ID}</p>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[statusText as keyof typeof STATUS_STYLES]}`}
                            >
                                {statusText}
                            </span>
                            <Button
                                variant={initialDriver.IsActive ? "secondary" : "primary"}
                                onClick={handleStatusToggle}
                                disabled={isUpdatingStatus}
                                className="text-xs px-3 py-1"
                            >
                                {isUpdatingStatus
                                    ? "Actualizando..."
                                    : initialDriver.IsActive
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
                                <p className="text-sm text-slate-700">{initialDriver.PhoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Licencia</p>
                                <p className="text-sm text-slate-700">{initialDriver.NumLicence}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Correo Electrónico
                                </p>
                                <p className="text-sm text-slate-700">{initialDriver.Email}</p>
                            </div>
                        </div>
                    </section>


                    {/* Assigned Orders Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Órden Asignada</h3>
                        <AssignedOrderInfo driver={initialDriver} />
                    </section>
                </div>
            </section>

            {/* Error Display */}
            {updateStatusError && (
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        Error al actualizar estado
                    </p>
                </div>
            )}
        </div>
    );
}

function AssignedOrderInfo({ driver }: { driver: DriverDetail }) {
    const router = useRouter();
    const hasOrder = driver.NumOrder && driver.NumOrder > 0;

    const getStatusConfig = (status?: string) => {
        const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_');

        switch (normalizedStatus) {
            case 'en_camino':
            case 'en camino':
                return {
                    label: 'En Camino',
                    color: 'bg-blue-50 text-blue-700 border-blue-200',
                    icon: '🚚'
                };
            case 'entregado':
                return {
                    label: 'Entregado',
                    color: 'bg-green-50 text-green-700 border-green-200',
                    icon: '✅'
                };
            case 'pendiente':
                return {
                    label: 'Pendiente',
                    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    icon: '⏳'
                };
            case 'cancelado':
                return {
                    label: 'Cancelado',
                    color: 'bg-red-50 text-red-700 border-red-200',
                    icon: '❌'
                };
            default:
                return {
                    label: status || 'Sin estado',
                    color: 'bg-slate-50 text-slate-600 border-slate-200',
                    icon: '📦'
                };
        }
    };

    const statusConfig = hasOrder ? getStatusConfig(driver.OrderStatus) : null;

    return (
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-sm font-semibold text-slate-900">
                            Orden Activa
                        </h4>
                        {hasOrder && statusConfig && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.color}`}>
                                <span>{statusConfig.icon}</span>
                                {statusConfig.label}
                            </span>
                        )}
                        {!hasOrder && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                Sin asignar
                            </span>
                        )}
                    </div>

                    {hasOrder ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-slate-900">
                                #{driver.NumOrder}
                            </p>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold text-slate-400">N/A</p>
                    )}
                </div>

                {hasOrder && (
                    <Button variant="secondary" className="gap-1.5 size-max" onClick={() => router.push(ROUTES.dashboard.orderDetail(driver.NumOrder!))}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                    </Button>
                )}
            </div>

            {!hasOrder && (
                <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>El conductor está disponible para nuevas asignaciones</span>
                </div>
            )}
        </div>
    );
}
