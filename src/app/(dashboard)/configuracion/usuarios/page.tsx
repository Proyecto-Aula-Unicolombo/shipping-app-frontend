import { BackButton } from "@/modules/dashboard/components/BackButton";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";

export default function UsersPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader eyebrow="Configuración" title="Usuarios" />

            </div>
        </div>
    );
}