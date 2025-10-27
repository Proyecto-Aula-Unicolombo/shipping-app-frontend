"use client";

import { PageHeader } from "../../components/PageHeader";
import { UserForm } from "../components/CreateUserForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { getUserById } from "@/mocks/users";

interface EditUserPageProps {
    userId: number;
}

export function EditUserPage({ userId }: EditUserPageProps) {
    const user = getUserById(userId);

    if (!user) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader
                        eyebrow="Configuración"
                        title="Usuario no encontrado"
                        description="El usuario que intentas editar no existe"
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
                    eyebrow="Configuración"
                    title="Editar Usuario"
                    description={`Modifica la información de ${user.Name} ${user.LastName}`}
                />
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <UserForm user={user} mode="edit" />
            </div>
        </div>
    );
}
