"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { DriverDetail } from "@/mocks/drivers";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";

type DriverDetailPageProps = {
    driver: DriverDetail;
};

const STATUS_STYLES = {
    Activo: "bg-emerald-50 text-emerald-700",
    Inactivo: "bg-amber-50 text-amber-600",
} as const;

export function DriverDetailPage({ driver }: DriverDetailPageProps) {
    const avatarUrl = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * 90);
        return `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Conductores"
                    title="Detalles del Conductor"
                    description="Vea la información del conductor y los detalles del vehículo asignado."
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
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[driver.status]}`}
                        >
                            {driver.status}
                        </span>
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
                        <h3 className="text-lg font-semibold text-slate-900">Información del Vehículo</h3>
                        <div className="grid gap-6 rounded-xl border border-slate-200 p-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Tipo de Vehículo
                                </p>
                                <p className="text-sm text-slate-700">{driver.Vehicle.VehicleType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marca</p>
                                <p className="text-sm text-slate-700">{driver.Vehicle.Brand}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modelo</p>
                                <p className="text-sm text-slate-700">{driver.Vehicle.Model}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Matrícula</p>
                                <p className="text-sm text-slate-700">{driver.Vehicle.Plate}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
