"use client";

import { PageHeader } from "../../components/PageHeader";
import { VehicleForm } from "../components/VehicleForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { useVehicleQueryStore } from "../hooks/useVehicleQueryStore";

interface EditVehiclePageProps {
    vehicleId: number;
}

export function EditVehiclePage({ vehicleId }: EditVehiclePageProps) {
    const { vehicleDetail, isDetailLoading, isDetailError } = useVehicleQueryStore({ vehicleId });

    if (isDetailLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader
                        eyebrow="Vehículos"
                        title="Vehículo no encontrado"
                        description="El vehículo que intentas editar no existe"
                    />
                </div>
            </div>
        );
    }
    if (isDetailError || !vehicleDetail) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader
                        eyebrow="Vehículos"
                        title="Cargando..."
                        description="Obteniendo información del vehículo"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Vehículos"
                    title="Editar Vehículo"
                    description={`Modifica la información del vehículo ${vehicleDetail.Plate}`}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <VehicleForm vehicle={vehicleDetail} mode="edit" />
            </div>
        </div>
    );
}
