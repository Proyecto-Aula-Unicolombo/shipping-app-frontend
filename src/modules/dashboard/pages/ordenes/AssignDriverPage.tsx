"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { ROUTES } from "@/modules/shared/constants/routes";
import { driversMock, type DriverListItem } from "@/mocks/drivers";
import { getUnassignedOrders } from "@/mocks/orders";

type DriverAvailabilityStatus = "Disponible" | "No disponible";

type DriverRow = Record<string, unknown> & {
    id: number;
    driverName: string;
    vehicle: string;
    status: DriverAvailabilityStatus;
    selected: boolean;
    actions?: null;
};

const AVAILABILITY_STATUS_STYLES: Record<DriverAvailabilityStatus, string> = {
    "Disponible": "bg-emerald-50 text-emerald-700",
    "No disponible": "bg-red-50 text-red-700",
};

export default function AssignDriverPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    
    // Find the order being assigned
    const unassignedOrders = getUnassignedOrders();
    const currentOrder = unassignedOrders.find(order => order.id.toString() === orderId);
    
    // Mock available drivers with availability status
    const availableDrivers: (DriverListItem & { availability: DriverAvailabilityStatus })[] = driversMock.map((driver, index) => ({
        ...driver,
        availability: index % 3 === 1 ? "No disponible" : "Disponible" as DriverAvailabilityStatus
    }));

    const columns: TableColumn<DriverRow>[] = [
        { key: "driverName", label: "Nombre de Conductor" },
        { key: "vehicle", label: "Vehículo" },
        {
            key: "status",
            label: "Estatus",
            render: (value) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${AVAILABILITY_STATUS_STYLES[value as DriverAvailabilityStatus]}`}>
                    {value as string}
                </span>
            ),
        },
        {
            key: "selected",
            label: "Select",
            render: (_, row) => (
                <input
                    type="radio"
                    name="selectedDriver"
                    checked={selectedDriverId === row.id}
                    onChange={() => setSelectedDriverId(row.id)}
                    disabled={row.status === "No disponible"}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                />
            ),
        },
    ];

    const tableRows = availableDrivers.map<DriverRow>((driver) => ({
        id: driver.id,
        driverName: `${driver.User.Name} ${driver.User.LastName}`,
        vehicle: `${driver.Vehicle.Brand} ${driver.Vehicle.Model}`,
        status: driver.availability,
        selected: selectedDriverId === driver.id,
        actions: null,
    }));

    const handleConfirmAssignment = () => {
        if (selectedDriverId) {
            const selectedDriver = availableDrivers.find(d => d.id === selectedDriverId);
            console.log(`Asignando orden ${orderId} al conductor ${selectedDriver?.User.Name} ${selectedDriver?.User.LastName}`);
            // Here you would typically make an API call to assign the order
            router.push(ROUTES.dashboard.orders);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Ordenes" title="Asignar ordenes a conductores" />
                    <p className="text-sm text-slate-600 mt-1">
                        {currentOrder 
                            ? `Asignando orden ORD-2023-${orderId.padStart(3, '0')} para ${currentOrder.ClientName}`
                            : "Selecciona un conductor y asignale una orden"
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Conductores disponibles</h3>
                    
                    <div className="space-y-4">
                        <Table
                            columns={columns}
                            data={tableRows}
                            getRowKey={(row) => row.id}
                            emptyState="No hay conductores disponibles"
                            rowClassName={(row) => 
                                row.status === "No disponible" ? "opacity-50" : ""
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleConfirmAssignment}
                        disabled={!selectedDriverId}
                        className="min-w-[120px]"
                    >
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
}
