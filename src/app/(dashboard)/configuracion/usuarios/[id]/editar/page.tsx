import { EditUserPage } from "@/modules/dashboard/users/ui/EditUserPage";

interface EditUserRouteProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditUserRoute({ params }: EditUserRouteProps) {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-900">ID de usuario inválido</h1>
                    <p className="text-slate-600 mt-2">El ID proporcionado no es válido.</p>
                </div>
            </div>
        );
    }

    return <EditUserPage userId={userId} />;
}
