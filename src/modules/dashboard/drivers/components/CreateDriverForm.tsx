"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCreateDriverForm } from "../hooks/useCreateDriverForm";
import { useDriverQueryStore } from "../hooks/useDriverQueryStore";
import { Form } from "@/modules/shared/form/Form";
import { FormField } from "@/modules/shared/ui/FormField";
import { Input } from "@/modules/shared/ui/Input";
import { Button } from "@/modules/shared/ui/Button";
import type { CreateDriverSchema } from "../schemas/createDriver.schema";
import { ROUTES } from "@/modules/shared/constants/routes";

export function CreateDriverForm() {
    const router = useRouter();
    const form = useCreateDriverForm();
    const { createDriverAsync, isCreating, createError } = useDriverQueryStore();
    
    const {
        register,
        formState: { errors },
        reset,
    } = form;

    const handleSubmit = useCallback(
        async (data: CreateDriverSchema) => {
            try {
                await createDriverAsync(data);
                // If successful, reset form and redirect
                reset();
                router.push(ROUTES.dashboard.drivers);
            } catch (error) {
                // Error is handled by React Query and displayed via createError
                console.error("Failed to create driver:", error);
            }
        },
        [createDriverAsync, reset, router]
    );

    return (
        <div className="space-y-8">
            <Form form={form} onSubmit={handleSubmit}>
                {/* Driver Information Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">Información del Conductor</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField label="Nombre" htmlFor="name" error={errors.name?.message}>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Ingresar nombre"
                                autoComplete="given-name"
                                isInvalid={Boolean(errors.name)}
                                {...register("name")}
                            />
                        </FormField>

                        <FormField label="Apellido" htmlFor="lastName" error={errors.lastName?.message}>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Ingresar apellido"
                                autoComplete="family-name"
                                isInvalid={Boolean(errors.lastName)}
                                {...register("lastName")}
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField label="Número de Teléfono" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="Ingresar número de teléfono"
                                autoComplete="tel"
                                isInvalid={Boolean(errors.phoneNumber)}
                                {...register("phoneNumber")}
                            />
                        </FormField>

                        <FormField label="Correo Electrónico" htmlFor="email" error={errors.email?.message}>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ingresar correo electrónico"
                                autoComplete="email"
                                isInvalid={Boolean(errors.email)}
                                {...register("email")}
                            />
                        </FormField>
                    </div>

                    <FormField label="Dirección" htmlFor="address" error={errors.address?.message}>
                        <Input
                            id="address"
                            type="text"
                            placeholder="Ingresar dirección"
                            autoComplete="street-address"
                            isInvalid={Boolean(errors.address)}
                            {...register("address")}
                        />
                    </FormField>

                    <FormField label="Licencia" htmlFor="license" error={errors.license?.message}>
                        <Input
                            id="license"
                            type="text"
                            placeholder="Ingresar número de licencia"
                            isInvalid={Boolean(errors.license)}
                            {...register("license")}
                        />
                    </FormField>
                </div>

                {/* Vehicle Assignment Note */}
                <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Asignación de Vehículos
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>
                                    Los vehículos ahora se gestionan por separado. Después de crear el conductor, 
                                    puede asignar un vehículo desde la sección de{" "}
                                    <a href="/vehiculos" className="font-medium underline hover:text-blue-600">
                                        Vehículos
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {createError && (
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {createError instanceof Error ? createError.message : "Error al crear el conductor"}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isCreating}
                        className="px-8"
                    >
                        {isCreating ? "Creando..." : "Añadir Conductor"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
