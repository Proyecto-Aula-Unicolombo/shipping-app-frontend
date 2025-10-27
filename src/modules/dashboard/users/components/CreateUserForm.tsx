"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/ui/Button";
import { Input } from "@/modules/shared/ui/Input";
import { Select } from "@/modules/shared/ui/Select";
import { FormField } from "@/modules/shared/ui/FormField";
import { createUserSchema, createUserDefaultValues, type CreateUserSchema } from "../schemas/createUser.schema";
import { useUserQueryStore } from "../hooks/useUserQueryStore";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { UserListItem } from "@/mocks/users";

interface UserFormProps {
    user?: UserListItem;
    mode: "create" | "edit";
}

export function UserForm({ user, mode }: UserFormProps) {
    const router = useRouter();
    const { createUserAsync, isCreating } = useUserQueryStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const isEditMode = mode === "edit";

    // Prepare default values based on mode
    const getDefaultValues = (): CreateUserSchema => {
        if (isEditMode && user) {
            return {
                name: user.Name,
                lastName: user.LastName,
                email: user.Email,
                password: "", // Always empty for security
                confirmPassword: "",
                role: user.Role as "coordinador" | "conductor" | "remitente",
                phoneNumber: "", // Would need to get from driver data if conductor
                license: "", // Would need to get from driver data if conductor
            };
        }
        return createUserDefaultValues;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema),
        defaultValues: getDefaultValues(),
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: CreateUserSchema) => {
        try {
            if (isEditMode && user) {
                // TODO: Implement updateUserAsync when needed
                console.log("Edit mode - would update user:", user.id, data);
                // For now, just navigate back
                router.push(ROUTES.settings.users);
            } else {
                await createUserAsync(data);
                reset();
                router.push(ROUTES.settings.users);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, error);
        }
    };

    const roleOptions = [
        { value: "coordinador", label: "Coordinador" },
        { value: "conductor", label: "Conductor" },
        { value: "remitente", label: "Remitente" },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Información Personal</h3>
                    
                    <FormField label="Nombre *" htmlFor="name" error={errors.name?.message}>
                        <Input
                            id="name"
                            type="text"
                            {...register("name")}
                            isInvalid={!!errors.name}
                            placeholder="Ingresa el nombre"
                        />
                    </FormField>

                    <FormField label="Apellido *" htmlFor="lastName" error={errors.lastName?.message}>
                        <Input
                            id="lastName"
                            type="text"
                            {...register("lastName")}
                            isInvalid={!!errors.lastName}
                            placeholder="Ingresa el apellido"
                        />
                    </FormField>

                    <FormField label="Email *" htmlFor="email" error={errors.email?.message}>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            isInvalid={!!errors.email}
                            placeholder="usuario@ejemplo.com"
                        />
                    </FormField>

                    <FormField label="Rol *" htmlFor="role" error={errors.role?.message}>
                        <Select
                            id="role"
                            {...register("role")}
                            isInvalid={!!errors.role}
                        >
                            <option value="">Selecciona un rol</option>
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                </div>

                {/* Información de Acceso */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Información de Acceso</h3>
                    
                    <FormField label="Contraseña *" htmlFor="password" error={errors.password?.message}>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                isInvalid={!!errors.password}
                                placeholder="Mínimo 6 caracteres"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </FormField>

                    <FormField label="Confirmar Contraseña *" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                isInvalid={!!errors.confirmPassword}
                                placeholder="Repite la contraseña"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </FormField>

                    {/* Campos específicos para conductores */}
                    {selectedRole === "conductor" && (
                        <>
                            <FormField label="Número de Teléfono *" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    {...register("phoneNumber")}
                                    isInvalid={!!errors.phoneNumber}
                                    placeholder="+57 300 123 4567"
                                />
                            </FormField>

                            <FormField label="Número de Licencia *" htmlFor="license" error={errors.license?.message}>
                                <Input
                                    id="license"
                                    type="text"
                                    {...register("license")}
                                    isInvalid={!!errors.license}
                                    placeholder="LIC-12345"
                                />
                            </FormField>
                        </>
                    )}
                </div>
            </div>

            {/* Información del rol seleccionado */}
            <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Información del Rol</h4>
                <div className="text-sm text-slate-600">
                    {selectedRole === "coordinador" && (
                        <p>Los coordinadores pueden gestionar órdenes, asignar conductores y supervisar operaciones.</p>
                    )}
                    {selectedRole === "conductor" && (
                        <p>Los conductores pueden ver sus órdenes asignadas, actualizar estados de entrega y reportar incidencias.</p>
                    )}
                    {selectedRole === "remitente" && (
                        <p>Los remitentes pueden crear nuevas órdenes de entrega y hacer seguimiento a sus envíos.</p>
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push(ROUTES.settings.users)}
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
                    {isCreating ? (isEditMode ? "Actualizando..." : "Creando...") : (isEditMode ? "Actualizar Usuario" : "Crear Usuario")}
                </Button>
            </div>
        </form>
    );
}

// Wrapper component for backward compatibility
export function CreateUserForm() {
    return <UserForm mode="create" />;
}
