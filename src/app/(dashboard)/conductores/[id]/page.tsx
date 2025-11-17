"use client";

import { notFound, useParams } from "next/navigation";
import { DriverDetailPage } from "@/modules/dashboard/pages/conductores/DriverDetailPage";
import { useDriverQueryStore } from "@/modules/dashboard/drivers/hooks/useDriverQueryStore";

export default function DriverDetailRoute() {
    const { id } = useParams();
    const driverId = Number(id);

    if (Number.isNaN(driverId)) {
        notFound();
    }

    const { 
        driverDetail, 
        isLoadingDetail, 
        isErrorDetail 
    } = useDriverQueryStore({ 
        driverId: driverId 
    });

    if (isLoadingDetail) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-600">Cargando conductor...</p>
                </div>
            </div>
        );
    }

    if (isErrorDetail || !driverDetail) {
        notFound();
    }

    return <DriverDetailPage driver={driverDetail} />;
}