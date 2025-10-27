import { PageHeader } from "../../components/PageHeader";
import { CreateUserForm } from "../components/CreateUserForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";

export function CreateUserPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Configuración"
                    title="Crear Usuario"
                    description="Crea un nuevo usuario y asigna su rol en el sistema"
                />
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <CreateUserForm />
            </div>
        </div>
    );
}
