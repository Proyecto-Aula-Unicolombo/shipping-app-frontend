"use client";

import { PageHeader } from "../../components/PageHeader";
import { UserForm } from "../components/CreateUserForm";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { useUserQueryStore } from "../hooks/useUserQueryStore";

interface EditUserPageProps {
    userId: number;
}

export function EditUserPage({ userId }: EditUserPageProps) {
    const { userDetail, isLoadingDetail, isErrorDetail } = useUserQueryStore({
        userId
    });

    if (isLoadingDetail) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader
                        eyebrow="Configuración"
                        title="Cargando..."
                        description="Obteniendo información del usuario"
                    />
                </div>
            </div>
        );
    }

    if (isErrorDetail || !userDetail) {
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
                    description={`Modifica la información de ${userDetail.Name} ${userDetail.LastName}`}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <UserForm user={userDetail} mode="edit" />
            </div>
        </div>
    );
}
