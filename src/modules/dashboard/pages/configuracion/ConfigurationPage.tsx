import { ActionCard } from "@/modules/shared/components/ActionCard";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { ROUTES } from "@/modules/shared/constants/routes";
import { PiUsersThreeLight } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";

export function ConfigurationPage() {
    return (
        <div className="space-y-10">
            <PageHeader eyebrow="Configuración" title="Configuración" />

            <div className="grid gap-3">
                <ActionCard
                    title="Usuarios y Roles"
                    description="Gestiona los usuarios y sus roles dentro de la plataforma. Define permisos específicos para cada rol para controlar el acceso a diferentes funcionalidades."
                    icon={<PiUsersThreeLight size={28} />}
                    tone="primary"
                    actionLabel="Administrar usuarios"
                    href={ROUTES.settings.users}
                />

                <ActionCard
                    title="Cerrar Sesión"
                    description="Cierra la sesión actual y vuelve al inicio de sesión."
                    icon={<FiLogOut size={24} />}
                    tone="danger"
                    actionLabel="Finalizar sesión"
                    href={ROUTES.auth.login}
                />
            </div>
        </div>
    );
}
