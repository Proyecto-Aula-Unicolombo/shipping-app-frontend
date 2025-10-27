"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/ui/Button";
import { Input } from "@/modules/shared/ui/Input";
import { useOrderQueryStore } from "../hooks/useOrderQueryStore";
import { ROUTES } from "@/modules/shared/constants/routes";
import type { PackageForSelection } from "../types/orderTypes";
import { getAvailableDrivers } from "@/mocks/drivers";
import { getAvailableVehicles } from "@/mocks/vehicles";

export function CreateOrderForm() {
    const router = useRouter();
    const {
        availablePackages,
        selectedPackages,
        togglePackageSelection,
        removeSelectedPackage,
        createOrderAsync,
        isCreating,
        createError
    } = useOrderQueryStore();

    // Form state
    const [serviceType, setServiceType] = useState<"Standard Delivery" | "Express Delivery">("Standard Delivery");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [priority, setPriority] = useState<"Alta" | "Media" | "Baja">("Media");
    const [notes, setNotes] = useState("");
    const [driverId, setDriverId] = useState<number | null>(null);
    const [vehicleId, setVehicleId] = useState<number | null>(null);

    // Get available drivers and vehicles
    const availableDrivers = getAvailableDrivers();
    const availableVehicles = getAvailableVehicles();

    const handlePackageToggle = (packageId: string) => {
        togglePackageSelection(packageId);
    };

    const handleRemoveSelected = (packageId: string) => {
        removeSelectedPackage(packageId);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPackages.length === 0) {
            alert("Debe seleccionar al menos un paquete");
            return;
        }

        if (!deliveryDate) {
            alert("Debe seleccionar una fecha de entrega");
            return;
        }

        if (!driverId) {
            alert("Debe seleccionar un conductor");
            return;
        }

        if (!vehicleId) {
            alert("Debe seleccionar un vehículo");
            return;
        }

        try {
            await createOrderAsync({
                selectedPackages: selectedPackages.map(p => p.packageId),
                serviceType,
                deliveryDate,
                priority,
                driverId,
                vehicleId,
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
                <h2 className="text-lg font-semibold text-slate-900">Paquetes disponibles</h2>
                <p className="text-sm text-slate-600">Selecciona paquetes disponibles y agrégalos a una orden</p>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                        <div className="grid grid-cols-5 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>Paquete ID</div>
                            <div>Nombre de cliente</div>
                            <div>Dirección de entrega</div>
                            <div>Estado</div>
                            <div>Select</div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {availablePackages.map((pkg: PackageForSelection) => {
                            const isSelected = selectedPackages.some(sp => sp.packageId === pkg.id);
                            return (
                                <div key={pkg.id} className="px-6 py-4 hover:bg-slate-50">
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                        <div className="text-sm font-medium text-slate-900">{pkg.id}</div>
                                        <div className="text-sm text-blue-600">{pkg.clientName}</div>
                                        <div className="text-sm text-slate-600">{pkg.deliveryAddress}</div>
                                        <div>
                                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-amber-50 text-amber-600">
                                                {pkg.status}
                                            </span>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handlePackageToggle(pkg.id)}
                                                className="rounded border-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Selected Packages Section */}
            {selectedPackages.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Selected Packages</h2>

                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                            <div className="grid grid-cols-5 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <div>Paquete ID</div>
                                <div>Nombre de Cliente</div>
                                <div>Dirección de entrega</div>
                                <div>Estado</div>
                                <div>Actions</div>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-200">
                            {selectedPackages.map((pkg) => (
                                <div key={pkg.packageId} className="px-6 py-4">
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                        <div className="text-sm font-medium text-slate-900">{pkg.packageId}</div>
                                        <div className="text-sm text-slate-600">{pkg.clientName}</div>
                                        <div className="text-sm text-slate-600">{pkg.deliveryAddress}</div>
                                        <div>
                                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-amber-50 text-amber-600">
                                                {pkg.status}
                                            </span>
                                        </div>
                                        <div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleRemoveSelected(pkg.packageId)}
                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            onChange={(e) => setServiceType(e.target.value as "Standard Delivery" | "Express Delivery")}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="Standard Delivery">Standard Delivery</option>
                            <option value="Express Delivery">Express Delivery</option>
                        </select>
                    </div>

                    {/* Delivery Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Fecha de Entrega
                        </label>
                        <Input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Prioridad
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as "Alta" | "Media" | "Baja")}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>

                    {/* Driver Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Conductor *
                        </label>
                        <select
                            value={driverId || ""}
                            onChange={(e) => setDriverId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar conductor</option>
                            {availableDrivers.map((driver) => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.User.Name} {driver.User.LastName} - {driver.License}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vehicle Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Vehículo *
                        </label>
                        <select
                            value={vehicleId || ""}
                            onChange={(e) => setVehicleId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar vehículo</option>
                            {availableVehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.Plate} - {vehicle.Brand} {vehicle.Model} ({vehicle.VehicleType})
                                </option>
                            ))}
                        </select>
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
                            {createError instanceof Error ? createError.message : "Error al crear la orden"}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isCreating || selectedPackages.length === 0 || !driverId || !vehicleId}
                        className="px-8"
                    >
                        {isCreating ? "Creando..." : "Crear orden"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
