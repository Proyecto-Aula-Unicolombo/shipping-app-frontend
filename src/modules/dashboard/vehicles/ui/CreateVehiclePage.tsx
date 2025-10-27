import { PageHeader } from "../../components/PageHeader";
import { VehicleForm } from "../components/VehicleForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";

export function CreateVehiclePage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Vehículos"
                    title="Crear Vehículo"
                    description="Registra un nuevo vehículo en la flota"
                />
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <VehicleForm mode="create" />
            </div>
        </div>
    );
}
