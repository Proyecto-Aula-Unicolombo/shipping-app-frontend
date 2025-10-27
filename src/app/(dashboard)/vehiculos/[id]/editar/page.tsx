import { EditVehiclePage } from "@/modules/dashboard/vehicles/ui/EditVehiclePage";

interface EditVehicleRouteProps {
    params: {
        id: string;
    };
}

export default function EditVehicleRoute({ params }: EditVehicleRouteProps) {
    const vehicleId = parseInt(params.id, 10);
    
    if (isNaN(vehicleId)) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-900">ID de vehículo inválido</h1>
                    <p className="text-slate-600 mt-2">El ID proporcionado no es válido.</p>
                </div>
            </div>
        );
    }

    return <EditVehiclePage vehicleId={vehicleId} />;
}
