"use client";

import { ConfirmDeliveryPage } from "@/modules/driver/pages/ConfirmDeliveryPage";
import { useParams } from "next/navigation";

export default function Page() {
    const { packageId } = useParams();

    if (isNaN(parseInt(String(packageId)))) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        ID de paquete inválido
                    </h2>
                    <p className="text-gray-600">
                        El ID del paquete debe ser un número válido.
                    </p>
                </div>
            </div>
        );
    }

    return <ConfirmDeliveryPage packageId={Number(packageId)} />;
}
