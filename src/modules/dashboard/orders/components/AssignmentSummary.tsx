import { memo } from "react";

export const AssignmentSummary = memo(({
    driver,
    vehicle
}: {
    driver?: any;
    vehicle?: any;
}) => {
    if (!driver || !vehicle) return null;

    return (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">
                Resumen de Asignación
            </h4>
            <div className="text-sm text-green-700">
                <p><strong>Conductor:</strong> {driver.Name} {driver.LastName}</p>
                <p><strong>Vehículo:</strong> {vehicle.Plate} - {vehicle.Brand} {vehicle.Model}</p>
            </div>
        </div>
    );
});