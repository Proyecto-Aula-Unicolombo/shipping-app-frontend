"use client";

import { useState, useMemo, useCallback, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { Button } from "@/modules/shared/ui/Button";
import { FormField } from "@/modules/shared/ui/FormField";
import { Select } from "@/modules/shared/ui/Select";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";
import { useOrderQueryStore } from "../../orders/hooks/useOrderQueryStore";
import { toast } from "sonner";
import { AssignmentSummary } from "../../orders/components/AssignmentSummary";
import { DriverCombobox } from "../../orders/components/DriverCombobox";
import { VehicleCombobox } from "../../orders/components/VehicleComboBox";


export default function AssignDriverPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [selectedDriverId, setSelectedDriverId] = useState<number | undefined>(undefined);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | undefined>(undefined);

    // Get drivers and vehicles from hooks
    const {
        driversUnassigned,
        isLoadingUnassigned: isLoadingDrivers,
        isErrorUnassigned: isErrorDrivers,
    } = useDriverQueryStore();

    const {
        vehiclesUnassigned,
        isLoadingUnassigned: isLoadingVehicles,
        isErrorUnassigned: isErrorVehicles,
    } = useVehicleQueryStore();

    // Get order details and assign mutation
    const {
        orderDetail,
        isLoadingOrderDetail,
        assignOrder,
        isAssigning,
    } = useOrderQueryStore({ orderrId: Number(orderId) });

    // Memoize available drivers and vehicles to prevent unnecessary re-renders
    const availableDrivers = useMemo(() => driversUnassigned || [], [driversUnassigned]);
    const availableVehicles = useMemo(() => vehiclesUnassigned || [], [vehiclesUnassigned]);

    // Memoize selected driver and vehicle to avoid repeated .find() calls
    const selectedDriver = useMemo(
        () => availableDrivers.find(d => d.ID === selectedDriverId),
        [availableDrivers, selectedDriverId]
    );

    const selectedVehicle = useMemo(
        () => availableVehicles.find(v => v.ID === selectedVehicleId),
        [availableVehicles, selectedVehicleId]
    );


    const handleDriverChange = useCallback((value: number | undefined) => {
        startTransition(() => {
            setSelectedDriverId(value);
        });
    }, []);

    const handleVehicleChange = useCallback((value: number | undefined) => {
        startTransition(() => {
            setSelectedVehicleId(value);
        });
    }, []);

    const handleConfirmAssignment = useCallback(async () => {
        if (!selectedDriverId || !selectedVehicleId) {
            toast.error("Por favor selecciona un conductor y un vehículo");
            return;
        }

        try {
            await assignOrder({
                orderrId: Number(orderId),
                driverId: selectedDriverId,
                vehicleId: selectedVehicleId,
            });

            toast.success("Orden asignada exitosamente");
            router.push(ROUTES.dashboard.orders);
        } catch (error) {
            console.error("Error asignando orden:", error);
            toast.error("Error al asignar la orden. Por favor intenta de nuevo.");
        }
    }, [selectedDriverId, selectedVehicleId, assignOrder, orderId, router]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Ordenes" title="Asignar Conductor y Vehículo" />
                    <p className="text-sm text-slate-600 mt-1">
                        {isLoadingOrderDetail
                            ? "Cargando información de la orden..."
                            : orderDetail
                                ? `Asignando orden #${orderDetail.ID}`
                                : "Selecciona un conductor y un vehículo para asignar a la orden"
                        }
                    </p>
                </div>
            </div>

            {/* Order Information Card */}
            {orderDetail && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Información de la Orden</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">ID de Orden</label>
                            <p className="text-sm text-blue-900">#{orderDetail.ID}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Tipo de Servicio</label>
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                                {orderDetail.TypeService}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Paquetes</label>
                            <p className="text-sm text-blue-900">{orderDetail.Packages?.length || 0} paquete(s)</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Asignación de Conductor y Vehículo</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Driver Selection */}
                        <DriverCombobox
                            drivers={availableDrivers}
                            value={selectedDriverId}
                            onChange={handleDriverChange}
                            isLoading={isLoadingDrivers}
                        />

                        {/* Vehicle Selection */}
                        <VehicleCombobox
                            vehicles={availableVehicles}
                            value={selectedVehicleId}
                            onChange={handleVehicleChange}
                            isLoading={isLoadingVehicles}
                        />

                    </div>

                    {/* Assignment Summary */}
                    <AssignmentSummary driver={selectedDriver} vehicle={selectedVehicle} />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={() => router.push(ROUTES.dashboard.orders)}
                        variant="secondary"
                        disabled={isAssigning}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAssignment}
                        disabled={!selectedDriverId || !selectedVehicleId || isAssigning}
                        className="min-w-[120px]"
                    >
                        {isAssigning ? "Asignando..." : "Confirmar Asignación"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
