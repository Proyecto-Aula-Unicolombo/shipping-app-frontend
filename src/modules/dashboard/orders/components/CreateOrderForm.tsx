"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/ui/Button";
import { useOrderQueryStore } from "../hooks/useOrderQueryStore";
import { ROUTES } from "@/modules/shared/constants/routes";
import { usePackageQueryStore } from "../hooks/usePakcageQueryStore";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";
import { PackageResponse } from "@/types/ordersWithPackage";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";

interface SelectedPackage {
    packageId: number;
    numPackage: string;
    clientName: string;
    deliveryAddress: string;
    status: string;
}

export function CreateOrderForm() {
    const router = useRouter();
    const [packagePage, setPackagePage] = useState(1);
    const [packagePageSize, setPackagePageSize] = useState<5 | 10 | 15>(10);


    const {
        createOrderAsync,
        isCreating,
        createError
    } = useOrderQueryStore();

    const {
        packages,
        totalItems,
        totalPages,
        isLoadingPackages,
    } = usePackageQueryStore({ limit: packagePageSize, page: packagePage });


    // Form state
    const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>([]);
    const [serviceType, setServiceType] = useState<"standard delivery" | "express delivery">("standard delivery");
    const [notes, setNotes] = useState("");
    const [driverId, setDriverId] = useState<number | null>(null);
    const [vehicleId, setVehicleId] = useState<number | null>(null);

    // Get available drivers and vehicles
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

    const handlePackageToggle = (pkg: PackageResponse) => {
        const isSelected = selectedPackages.some(sp => sp.packageId === pkg.ID);

        if (isSelected) {
            setSelectedPackages(prev => prev.filter(p => p.packageId !== pkg.ID));
        } else {
            const newPackage: SelectedPackage = {
                packageId: pkg.ID,
                numPackage: pkg.NumPackage,
                clientName: `${pkg.Receiver.name} ${pkg.Receiver.last_name}`,
                deliveryAddress: pkg.AddressPackage.destination,
                status: pkg.Status,
            };
            setSelectedPackages(prev => [...prev, newPackage]);
        }
    };

    const handleRemoveSelected = (packageId: number) => {
        setSelectedPackages(prev => prev.filter(p => p.packageId !== packageId));
    };

    const handlePackagePageChange = (newPage: number) => {
        const validPage = Math.min(Math.max(1, newPage), totalPages);
        setPackagePage(validPage);
    };

    const handlePackagePageSizeChange = (newSize: 5 | 10 | 15) => {
        setPackagePageSize(newSize);
        setPackagePage(1);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPackages.length === 0) {
            alert("Debe seleccionar al menos un paquete");
            return;
        }

        try {
            await createOrderAsync({
                package_ids: selectedPackages.map(p => p.packageId.toString()),
                serviceType,
                driverId: driverId || undefined,
                vehicleId: vehicleId || undefined,
                notes: notes || undefined,
            });
            router.push(ROUTES.dashboard.orders);
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Available Packages Section */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Paquetes disponibles</h2>
                        <p className="text-sm text-slate-600">
                            Selecciona paquetes pendientes y agrégalos a la orden
                        </p>
                    </div>
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        {selectedPackages.length} seleccionado(s)
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {/* Wrapper con scroll horizontal */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                                <div className="grid grid-cols-6 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <div>Número</div>
                                    <div>Cliente</div>
                                    <div className="col-span-2">Dirección de entrega</div>
                                    <div>Estado</div>
                                    <div className="text-center">Seleccionar</div>
                                </div>
                            </div>

                            {isLoadingPackages ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-sm text-slate-600">Cargando paquetes...</p>
                                </div>
                            ) : packages.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-sm text-slate-600">No hay paquetes pendientes disponibles</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {packages.map((pkg) => {
                                        const isSelected = selectedPackages.some(sp => sp.packageId === pkg.ID);
                                        return (
                                            <div
                                                key={pkg.ID}
                                                className={`px-6 py-4 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="grid grid-cols-6 gap-4 items-center">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        #{pkg.NumPackage}
                                                    </div>
                                                    <div className="text-sm text-blue-600">
                                                        {pkg.Receiver.name} {pkg.Receiver.last_name}
                                                    </div>
                                                    <div className="col-span-2 text-sm text-slate-600 truncate" title={pkg.AddressPackage.destination}>
                                                        {pkg.AddressPackage.destination}
                                                    </div>
                                                    <div>
                                                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-amber-50 text-amber-600">
                                                            {pkg.Status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handlePackageToggle(pkg)}
                                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paginación */}
                    <TablePagination
                        page={packagePage}
                        pageSize={packagePageSize}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={handlePackagePageChange}
                        onPageSizeChange={handlePackagePageSizeChange}
                        className="border-t border-slate-200"
                    />
                </div>
            </section>


            {/* Selected Packages Section */}
            {selectedPackages.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Paquetes seleccionados ({selectedPackages.length})
                    </h2>
                    <div className="rounded-xl border border-blue-200 overflow-hidden bg-white">
                        {/* Wrapper con scroll horizontal */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                                    <div className="grid grid-cols-5 gap-4 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                        <div>Número</div>
                                        <div>Cliente</div>
                                        <div className="col-span-2">Dirección</div>
                                        <div>Acción</div>
                                    </div>
                                </div>
                                <div className="divide-y divide-blue-100 bg-white">
                                    {selectedPackages.map((pkg) => (
                                        <div key={pkg.packageId} className="px-6 py-4 hover:bg-blue-50/30 transition-colors">
                                            <div className="grid grid-cols-5 gap-4 items-center">
                                                <div className="text-sm font-medium text-slate-900">
                                                    #{pkg.numPackage}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    {pkg.clientName}
                                                </div>
                                                <div className="col-span-2 text-sm text-slate-600 truncate" title={pkg.deliveryAddress}>
                                                    {pkg.deliveryAddress}
                                                </div>
                                                <div>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleRemoveSelected(pkg.packageId)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                                                    >
                                                        Remover
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Order Creation Form */}
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Service Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Tipo de Servicio
                        </label>
                        <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value as "standard delivery" | "express delivery")}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="standard delivery">Standard Delivery</option>
                            <option value="express delivery">Express Delivery</option>
                        </select>
                    </div>



                    {/* Driver Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Conductor (Opcional)
                        </label>
                        {isLoadingDrivers ? (
                            <div className="flex items-center justify-center py-3 border border-slate-300 rounded-md">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-sm text-slate-600">Cargando conductores...</span>
                            </div>
                        ) : isErrorDrivers ? (
                            <div className="py-3 px-3 border border-red-300 rounded-md bg-red-50">
                                <span className="text-sm text-red-600">Error al cargar conductores</span>
                            </div>
                        ) : (
                            <select
                                value={driverId || ""}
                                onChange={(e) => setDriverId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar conductor</option>
                                {driversUnassigned.length === 0 ? (
                                    <option disabled>No hay conductores disponibles</option>
                                ) : (
                                    driversUnassigned.map((driver) => (
                                        <option key={driver.ID} value={driver.ID}>
                                            {driver.Name} {driver.LastName} - {driver.License}
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                        {!isLoadingDrivers && driversUnassigned.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                No hay conductores sin asignar disponibles
                            </p>
                        )}
                    </div>

                    {/* Vehicle Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Vehículo (Opcional)
                        </label>
                        {isLoadingVehicles ? (
                            <div className="flex items-center justify-center py-3 border border-slate-300 rounded-md">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-sm text-slate-600">Cargando vehículos...</span>
                            </div>
                        ) : isErrorVehicles ? (
                            <div className="py-3 px-3 border border-red-300 rounded-md bg-red-50">
                                <span className="text-sm text-red-600">Error al cargar vehículos</span>
                            </div>
                        ) : (
                            <select
                                value={vehicleId || ""}
                                onChange={(e) => setVehicleId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar vehículo</option>
                                {vehiclesUnassigned.length === 0 ? (
                                    <option disabled>No hay vehículos disponibles</option>
                                ) : (
                                    vehiclesUnassigned.map((vehicle) => (
                                        <option key={vehicle.ID} value={vehicle.ID}>
                                            {vehicle.Plate} - {vehicle.Brand} {vehicle.Model} ({vehicle.VehicleType})
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                        {!isLoadingVehicles && vehiclesUnassigned.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                No hay vehículos sin asignar disponibles
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Notas (Opcional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Agregar notas adicionales para la orden..."
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Error Display */}
                {createError && (
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {"Error al crear la orden"}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            isCreating ||
                            selectedPackages.length === 0 ||
                            isLoadingDrivers ||
                            isLoadingVehicles
                        }
                        className="px-8"
                    >
                        {isCreating
                            ? "Creando orden..."
                            : `Crear orden con ${selectedPackages.length} paquete(s)`
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
}
