"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";
import { BackButton } from "../../components/BackButton";

type VehicleDetailPageProps = {
    vehicle: any;
};

export function VehicleDetailPage({ vehicle: initialVehicle }: VehicleDetailPageProps) {
    const { vehicles } = useVehicleQueryStore();
    
    // Get the current vehicle from the store to ensure we have the latest data
    const vehicle = useMemo(() => {
        const currentVehicle = vehicles.find(v => v.id === initialVehicle.id);
        return currentVehicle || initialVehicle;
    }, [vehicles, initialVehicle]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Vehículos"
                    title="Detalles del Vehículo"
                    description="Vea la información del vehículo y el conductor asignado."
                />
            </div>

            <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Vehicle Information */}
                    <div className="flex-1 space-y-6">
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Información del Vehículo</h3>
                            <div className="grid gap-6 rounded-xl border border-slate-200 p-6 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Placa
                                    </p>
                                    <p className="text-sm text-slate-700 font-mono">{vehicle.Plate}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Tipo de Vehículo
                                    </p>
                                    <p className="text-sm text-slate-700">{vehicle.VehicleType}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marca</p>
                                    <p className="text-sm text-slate-700">{vehicle.Brand}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modelo</p>
                                    <p className="text-sm text-slate-700">{vehicle.Model}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Color</p>
                                    <p className="text-sm text-slate-700">{vehicle.Color}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID del Vehículo</p>
                                    <p className="text-sm text-slate-700">{vehicle.id}</p>
                                </div>
                            </div>
                        </section>

                        {/* Order Assignments Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Asignaciones de Órdenes</h3>
                            </div>
                            
                            <div className="rounded-xl border border-slate-200 p-6 text-center">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    Los vehículos se asignan a conductores a través de las órdenes de entrega
                                </p>
                                <p className="text-xs text-slate-500">
                                    Para asignar este vehículo a un conductor, cree una nueva orden desde la sección de{" "}
                                    <Link href="/ordenes/crear" className="text-blue-600 hover:underline font-medium">
                                        Crear Orden
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

        </div>
    );
}
