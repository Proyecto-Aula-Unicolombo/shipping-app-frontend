"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Input } from "@/modules/shared/ui/Input";
import { Select } from "@/modules/shared/ui/Select";
import { FormField } from "@/modules/shared/ui/FormField";
import { BackButton } from "../../components/BackButton";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";
import {
    createVehicleSchema,
    createVehicleDefaultValues,
    vehicleTypes,
    type CreateVehicleSchema,
} from "../../vehicles/schemas/createVehicle.schema";

export default function CreateVehiclePage() {
    const router = useRouter();
    const { createVehicleAsync, isCreatingVehicle, createVehicleError } = useVehicleQueryStore();
    const { drivers } = useDriverQueryStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateVehicleSchema>({
        resolver: zodResolver(createVehicleSchema),
        defaultValues: createVehicleDefaultValues,
    });

    const onSubmit = async (data: CreateVehicleSchema) => {
        try {
            const vehicleData = {
                Plate: data.plate,
                Brand: data.brand,
                Model: data.model,
                Color: data.color,
                VehicleType: data.vehicleType,
                driverId: data.driverId,
                driverName: data.driverId ? drivers.find(d => d.id === data.driverId)?.User.Name : undefined,
            };

            await createVehicleAsync(vehicleData);
            router.push(ROUTES.dashboard.vehicles);
        } catch (error) {
            console.error("Error creating vehicle:", error);
        }
    };

    const handleCancel = () => {
        reset();
        router.push(ROUTES.dashboard.vehicles);
    };

    // Get available drivers (those without assigned vehicles)
    const availableDrivers = drivers.filter(driver => !driver.Vehicle);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <PageHeader
                    eyebrow="Vehículos"
                    title="Crear Vehículo"
                    description="Agregue un nuevo vehículo al sistema."
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900">Información del Vehículo</h3>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                label="Placa"
                                htmlFor="plate"
                                error={errors.plate?.message}
                            >
                                <Input
                                    id="plate"
                                    placeholder="Ej: ABC 123"
                                    isInvalid={!!errors.plate}
                                    {...register("plate")}
                                />
                            </FormField>

                            <FormField
                                label="Tipo de Vehículo"
                                htmlFor="vehicleType"
                                error={errors.vehicleType?.message}
                            >
                                <Select
                                    id="vehicleType"
                                    isInvalid={!!errors.vehicleType}
                                    {...register("vehicleType")}
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {vehicleTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>

                            <FormField
                                label="Marca"
                                htmlFor="brand"
                                error={errors.brand?.message}
                            >
                                <Input
                                    id="brand"
                                    placeholder="Ej: Toyota"
                                    isInvalid={!!errors.brand}
                                    {...register("brand")}
                                />
                            </FormField>

                            <FormField
                                label="Modelo"
                                htmlFor="model"
                                error={errors.model?.message}
                            >
                                <Input
                                    id="model"
                                    placeholder="Ej: Hiace"
                                    isInvalid={!!errors.model}
                                    {...register("model")}
                                />
                            </FormField>

                            <FormField
                                label="Color"
                                htmlFor="color"
                                error={errors.color?.message}
                            >
                                <Input
                                    id="color"
                                    placeholder="Ej: Blanco"
                                    isInvalid={!!errors.color}
                                    {...register("color")}
                                />
                            </FormField>

                            <FormField
                                label="Conductor Asignado (Opcional)"
                                htmlFor="driverId"
                                error={errors.driverId?.message}
                            >
                                <Select
                                    id="driverId"
                                    isInvalid={!!errors.driverId}
                                    {...register("driverId", { valueAsNumber: true })}
                                >
                                    <option value="">Sin asignar</option>
                                    {availableDrivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.User.Name} {driver.User.LastName}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                        </div>
                    </div>
                </section>

                {/* Error Display */}
                {createVehicleError && (
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            Error al crear vehículo: {createVehicleError instanceof Error ? createVehicleError.message : "Error desconocido"}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isCreatingVehicle}
                        className="flex-1 md:flex-none"
                    >
                        {isCreatingVehicle ? "Creando..." : "Crear Vehículo"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isCreatingVehicle}
                        className="flex-1 md:flex-none"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
