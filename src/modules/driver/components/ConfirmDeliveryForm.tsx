"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    FiCamera,
    FiCheckCircle,
    FiAlertCircle,
    FiX
} from "react-icons/fi";
import { Button } from "@/modules/shared/ui/Button";
import { FormField } from "@/modules/shared/ui/FormField";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { ROUTES } from "@/modules/shared/constants/routes";
import { getPackageById, packagesMock } from "@/mocks/orders";

// Schema de validación para la confirmación de entrega
const confirmDeliverySchema = z.object({
    deliveryStatus: z.enum(["entregado", "no_entregado", "incidente"]),
    notes: z.string().optional(),
    photo: z.string().optional()
});

type ConfirmDeliveryFormData = z.infer<typeof confirmDeliverySchema>;

interface ConfirmDeliveryFormProps {
    packageId: number;
}

export function ConfirmDeliveryForm({ packageId }: ConfirmDeliveryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Obtener información del paquete
    const packageInfo = getPackageById(packageId);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ConfirmDeliveryFormData>({
        resolver: zodResolver(confirmDeliverySchema),
        defaultValues: {
            deliveryStatus: "entregado"
        }
    });

    const deliveryStatus = watch("deliveryStatus");

    if (!packageInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <FiAlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Paquete no encontrado
                    </h2>
                    <p className="text-gray-600 mb-4">
                        El paquete #{packageId} no existe o no está disponible.
                    </p>
                    <Button
                        onClick={() => router.push(ROUTES.driver.packages)}
                        variant="secondary"
                    >
                        Volver a Paquetes
                    </Button>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: ConfirmDeliveryFormData) => {
        setIsSubmitting(true);

        try {
            // Simular actualización del paquete
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Actualizar el estado del paquete en el mock
            const packageIndex = packagesMock.findIndex(pkg => pkg.id === packageId);
            if (packageIndex !== -1) {
                packagesMock[packageIndex] = {
                    ...packagesMock[packageIndex],
                    StartStatus: data.deliveryStatus === "entregado" ? "Entregado" :
                        data.deliveryStatus === "no_entregado" ? "No entregado" : "Incidente",
                    UpdateAt: new Date().toISOString().split('T')[0]
                };
            }

            // Navegar de vuelta a la lista de paquetes
            router.push(ROUTES.driver.packages);
        } catch (error) {
            console.error("Error al confirmar entrega:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "entregado":
                return "bg-green-100 text-green-800 border-green-200";
            case "no_entregado":
                return "bg-red-100 text-red-800 border-red-200";
            case "incidente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "entregado":
                return <FiCheckCircle size={20} />;
            case "no_entregado":
                return <FiX size={20} />;
            case "incidente":
                return <FiAlertCircle size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 lg:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <BackButton />
                    <PageHeader
                        title="Confirmar Entrega"
                        description={`Confirma la entrega del paquete #${packageId}`}
                    />
                </div>

                <div className="max-w-md mx-auto">
                {/* Información del Paquete */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Paquete #{packageInfo.id}
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                            <span className="font-medium">Descripción:</span> {packageInfo.DescriptionContent}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Peso:</span> {packageInfo.Weight} kg
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Tipo:</span> {packageInfo.TypePackage}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Valor:</span> ${packageInfo.DeclaredValue.toLocaleString()}
                        </p>
                        {packageInfo.IsFragile && (
                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                                <FiAlertCircle size={14} className="text-amber-600" />
                                <span className="text-sm text-amber-700 font-medium">
                                    Frágil - Manejar con cuidado
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Formulario de Confirmación */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Prueba de entrega */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">
                            Prueba de entrega
                        </h3>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <FiCamera size={20} />
                            <span>Tomar o añadir foto</span>
                        </button>
                    </div>

                    {/* Estado de Entrega */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Estado de Entrega
                        </h3>
                        <div className="space-y-3">
                            {[
                                { value: "entregado", label: "Entregado" },
                                { value: "no_entregado", label: "No entregado" },
                                { value: "incidente", label: "Incidente" }
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${deliveryStatus === option.value
                                            ? getStatusColor(option.value)
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={option.value}
                                        {...register("deliveryStatus")}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryStatus === option.value
                                            ? "border-current bg-current text-white"
                                            : "border-gray-300"
                                        }`}>
                                        {deliveryStatus === option.value && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(option.value)}
                                        <span className="font-medium">{option.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.deliveryStatus && (
                            <p className="text-red-600 text-sm mt-2">
                                {errors.deliveryStatus.message}
                            </p>
                        )}
                    </div>

                    {/* Notas */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <FormField
                            label="Notas"
                            htmlFor="notes"
                            error={errors.notes?.message}
                        >
                            <textarea
                                id="notes"
                                {...register("notes")}
                                placeholder="Agregar notas adicionales (opcional)"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </FormField>
                    </div>

                    {/* Botón de Confirmación */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                    >
                        {isSubmitting ? "Confirmando Entrega..." : "Confirmar Entrega"}
                    </Button>
                </form>
                </div>
            </div>
        </div>
    );
}
