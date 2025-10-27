import { PageHeader } from "../../components/PageHeader";
import { CreateDriverForm } from "../components/CreateDriverForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";

export function CreateDriverPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Conductores"
                    title="Añadir Nuevo Conductor"
                    description="Complete la información del conductor y los detalles del vehículo para añadir un nuevo conductor al sistema."
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <CreateDriverForm />
            </div>
        </div>
    );
}
