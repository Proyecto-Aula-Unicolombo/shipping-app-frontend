"use client";

import { notFound, useParams } from "next/navigation";
import { DriverDetailPage } from "@/modules/dashboard/pages/conductores/DriverDetailPage";
import { getDriverById } from "@/mocks/drivers";

export default function DriverDetailRoute() {
    const { id } = useParams();
    const driverId = Number(id);

    if (Number.isNaN(driverId)) {
        notFound();
    }

    const driver = getDriverById(driverId);

    if (!driver) {
        notFound();
    }

    return <DriverDetailPage driver={driver} />;
}
