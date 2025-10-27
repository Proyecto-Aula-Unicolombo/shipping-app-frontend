"use client";

import { PageHeader } from "../../components/PageHeader";
import { VehicleForm } from "../components/VehicleForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { getVehicleById } from "@/mocks/vehicles";

interface EditVehiclePageProps {
    vehicleId: number;
}

export function EditVehiclePage({ vehicleId }: EditVehiclePageProps) {
    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
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

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Vehículos"
                    title="Editar Vehículo"
                    description={`Modifica la información del vehículo ${vehicle.Plate}`}
                />
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <VehicleForm vehicle={vehicle} mode="edit" />
            </div>
        </div>
    );
}
