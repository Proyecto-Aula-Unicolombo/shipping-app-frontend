"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { Button } from "@/modules/shared/ui/Button";
import { FormField } from "@/modules/shared/ui/FormField";
import { Select } from "@/modules/shared/ui/Select";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";
import { getUnassignedOrders } from "@/mocks/orders";


export default function AssignDriverPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    
    const [selectedDriverId, setSelectedDriverId] = useState<number | undefined>(undefined);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | undefined>(undefined);
    
    // Get drivers and vehicles from hooks
    const { drivers } = useDriverQueryStore();
    const { vehicles } = useVehicleQueryStore();
    
    // Find the order being assigned
    const unassignedOrders = getUnassignedOrders();
    const currentOrder = unassignedOrders.find(order => order.id.toString() === orderId);
    
    // Filter available drivers (only active ones)
    const availableDrivers = drivers.filter(driver => driver.status === "Activo");
    const availableVehicles = vehicles;


    const handleConfirmAssignment = () => {
        if (selectedDriverId && selectedVehicleId) {
            const selectedDriver = availableDrivers.find(d => d.id === selectedDriverId);
            const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId);
            console.log(`Asignando orden ${orderId} al conductor ${selectedDriver?.User.Name} ${selectedDriver?.User.LastName} con vehículo ${selectedVehicle?.Plate}`);
            // Here you would typically make an API call to assign the order with both driver and vehicle
            router.push(ROUTES.dashboard.orders);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Ordenes" title="Asignar Conductor y Vehículo" />
                    <p className="text-sm text-slate-600 mt-1">
                        {currentOrder 
                            ? `Asignando orden ORD-2023-${orderId.padStart(3, '0')} para ${currentOrder.ClientName}`
                            : "Selecciona un conductor y un vehículo para asignar a la orden"
                        }
                    </p>
                </div>
            </div>

            {/* Order Information Card */}
            {currentOrder && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Información de la Orden</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Cliente</label>
                            <p className="text-sm text-blue-900">{currentOrder.ClientName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Dirección de Entrega</label>
                            <p className="text-sm text-blue-900">{currentOrder.DeliveryAddress}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Tipo de Servicio</label>
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                                {currentOrder.ServiceType}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Asignación de Conductor y Vehículo</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Driver Selection */}
                        <FormField
                            label="Conductor Asignado"
                            htmlFor="driverId"
                        >
                            <Select
                                id="driverId"
                                value={selectedDriverId || ""}
                                onChange={(e) => setSelectedDriverId(e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">Seleccionar conductor</option>
                                {availableDrivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.User.Name} {driver.User.LastName} - {driver.License}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        {/* Vehicle Selection */}
                        <FormField
                            label="Vehículo Asignado"
                            htmlFor="vehicleId"
                        >
                            <Select
                                id="vehicleId"
                                value={selectedVehicleId || ""}
                                onChange={(e) => setSelectedVehicleId(e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">Seleccionar vehículo</option>
                                {availableVehicles.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.Plate} - {vehicle.Brand} {vehicle.Model} ({vehicle.VehicleType})
                                    </option>
                                ))}
                            </Select>
                        </FormField>
                    </div>

                    {/* Assignment Summary */}
                    {selectedDriverId && selectedVehicleId && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800 mb-2">Resumen de Asignación</h4>
                            <div className="text-sm text-green-700">
                                <p><strong>Conductor:</strong> {availableDrivers.find(d => d.id === selectedDriverId)?.User.Name} {availableDrivers.find(d => d.id === selectedDriverId)?.User.LastName}</p>
                                <p><strong>Vehículo:</strong> {availableVehicles.find(v => v.id === selectedVehicleId)?.Plate} - {availableVehicles.find(v => v.id === selectedVehicleId)?.Brand} {availableVehicles.find(v => v.id === selectedVehicleId)?.Model}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleConfirmAssignment}
                        disabled={!selectedDriverId || !selectedVehicleId}
                        className="min-w-[120px]"
                    >
                        Confirmar Asignación
                    </Button>
                </div>
            </div>
        </div>
    );
}
