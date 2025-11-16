"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/ui/Button";
import { Input } from "@/modules/shared/ui/Input";
import { Select } from "@/modules/shared/ui/Select";
import { FormField } from "@/modules/shared/ui/FormField";
import { createVehicleSchema, createVehicleDefaultValues, vehicleTypes, type CreateVehicleSchema } from "../schemas/createVehicle.schema";
import { useVehicleQueryStore } from "../hooks/useVehicleQueryStore";
import { ROUTES } from "@/modules/shared/constants/routes";
import type { VehicleListItem } from "@/mocks/vehicles";

interface VehicleFormProps {
    vehicle?: VehicleListItem;
    mode: "create" | "edit";
}

export function VehicleForm({ vehicle, mode }: VehicleFormProps) {
    const router = useRouter();
    const { createVehicleAsync, isCreating } = useVehicleQueryStore();

    const isEditMode = mode === "edit";

    // Prepare default values based on mode
    const getDefaultValues = (): CreateVehicleSchema => {
        if (isEditMode && vehicle) {
            return {
                plate: vehicle.Plate,
                brand: vehicle.Brand,
                model: vehicle.Model,
                color: vehicle.Color,
                vehicleType: vehicle.VehicleType,
            };
        }
        return createVehicleDefaultValues;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateVehicleSchema>({
        resolver: zodResolver(createVehicleSchema),
        defaultValues: getDefaultValues(),
    });

    const onSubmit = async (data: CreateVehicleSchema) => {
        try {
            if (isEditMode && vehicle) {
                // TODO: Implement updateVehicleAsync when needed
                console.log("Edit mode - would update vehicle:", vehicle.id, data);
                // For now, just navigate back
                router.push(ROUTES.dashboard.vehicles);
            } else {
                await createVehicleAsync(data);
                reset();
                router.push(ROUTES.dashboard.vehicles);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} vehicle:`, error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Vehículo */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Información del Vehículo</h3>

                    <FormField label="Placa *" htmlFor="plate" error={errors.plate?.message}>
                        <Input
                            id="plate"
                            type="text"
                            {...register("plate")}
                            isInvalid={!!errors.plate}
                            placeholder="ABC-123"
                        />
                    </FormField>

                    <FormField label="Marca *" htmlFor="brand" error={errors.brand?.message}>
                        <Input
                            id="brand"
                            type="text"
                            {...register("brand")}
                            isInvalid={!!errors.brand}
                            placeholder="Toyota, Ford, etc."
                        />
                    </FormField>

                    <FormField label="Modelo *" htmlFor="model" error={errors.model?.message}>
                        <Input
                            id="model"
                            type="text"
                            {...register("model")}
                            isInvalid={!!errors.model}
                            placeholder="Hiace, Transit, etc."
                        />
                    </FormField>
                </div>

                {/* Características */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Características</h3>

                    <FormField label="Color *" htmlFor="color" error={errors.color?.message}>
                        <Input
                            id="color"
                            type="text"
                            {...register("color")}
                            isInvalid={!!errors.color}
                            placeholder="Blanco, Azul, etc."
                        />
                    </FormField>

                    <FormField label="Tipo de Vehículo *" htmlFor="vehicleType" error={errors.vehicleType?.message}>
                        <Select
                            id="vehicleType"
                            {...register("vehicleType")}
                            isInvalid={!!errors.vehicleType}
                        >
                            <option value="">Selecciona un tipo</option>
                            {vehicleTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                </div>
            </div>

            {/* Información del tipo de vehículo */}
            <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Información del Tipo</h4>
                <div className="text-sm text-slate-600">
                    <p>Selecciona el tipo de vehículo según su capacidad y uso previsto para las entregas.</p>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push(ROUTES.dashboard.vehicles)}
                    disabled={isCreating}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={isCreating}
                    className="min-w-[120px]"
                >
                    {isCreating ? (isEditMode ? "Actualizando..." : "Creando...") : (isEditMode ? "Actualizar Vehículo" : "Crear Vehículo")}
                </Button>
            </div>
        </form>
    );
}

// Wrapper component for backward compatibility
export function CreateVehicleForm() {
    return <VehicleForm mode="create" />;
}
