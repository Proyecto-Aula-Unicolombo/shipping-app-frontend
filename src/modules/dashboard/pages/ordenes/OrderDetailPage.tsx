"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { getOrderById, getPackagesByOrderId } from "@/mocks/orders";

type PackageStatus = "Entregado" | "En Tránsito" | "Pendiente";

type PackageRow = Record<string, unknown> & {
    id: string;
    packageId: string;
    status: PackageStatus;
    deliveryDate: string;
    actions?: null;
};

const PACKAGE_STATUS_STYLES: Record<PackageStatus, string> = {
    "Entregado": "bg-emerald-50 text-emerald-700",
    "En Tránsito": "bg-blue-50 text-blue-700",
    "Pendiente": "bg-amber-50 text-amber-600",
};

const packageColumns: TableColumn<PackageRow>[] = [
    {
        key: "packageId",
        label: "ID del Paquete",
        render: (value: unknown, row: PackageRow) => (
            <Link href={`/ordenes/paquete/${row.id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                {String(value)}
            </Link>
        )
    },
    {
        key: "status",
        label: "Estado",
        render: (value: unknown) => (
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${PACKAGE_STATUS_STYLES[value as PackageStatus]}`}>
                {String(value)}
            </span>
        ),
    },
    {
        key: "deliveryDate",
        label: "Fecha de Entrega"
    },
    {
        key: "actions",
        label: "Acciones",
        render: (value: unknown, row: PackageRow) => (
            <Link href={`/ordenes/paquete/${row.id}`} className="text-sm font-semibold text-[#4D7399] hover:underline">
                Ver Detalles
            </Link>
        ),
    },
];

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = parseInt(params.id as string);

    const order = useMemo(() => getOrderById(orderId), [orderId]);
    const packages = useMemo(() => getPackagesByOrderId(orderId), [orderId]);

    if (!order) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <PageHeader eyebrow="Ordenes" title="Orden no encontrada" />
                </div>
                <div className="text-center py-12">
                    <p className="text-slate-600">La orden solicitada no existe.</p>
                </div>
            </div>
        );
    }

    const packageRows = packages.map<PackageRow>((pkg) => ({
        id: pkg.id.toString(),
        packageId: `Paquete#${pkg.id}`,
        status: pkg.StartStatus as PackageStatus,
        deliveryDate: typeof pkg.CreateAt === 'string' ? pkg.CreateAt : pkg.CreateAt?.toISOString().split('T')[0] || '',
        actions: null,
    }));

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Ordenes" title={`Orden #${order.id}`} />
                    <p className="text-sm text-slate-600 mt-1">Visualiza y gestiona todos los paquetes asociados a esta orden.</p>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información de la Orden</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.Status === "En camino" ? "bg-blue-50 text-blue-700" :
                                order.Status === "Entregado" ? "bg-emerald-50 text-emerald-700" :
                                    "bg-amber-50 text-amber-600"
                            }`}>
                            {order.Status}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                        <p className="text-sm text-slate-900">{order.ClientName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
                        <p className="text-sm text-slate-900">{order.ContactPhone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dirección de Entrega</label>
                        <p className="text-sm text-slate-900">{order.DeliveryAddress}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.ServiceType === "Express Delivery" ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-700"
                            }`}>
                            {order.ServiceType}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SLA</label>
                        <p className="text-sm text-slate-900">{order.SLA}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ETA</label>
                        <p className="text-sm text-slate-900">{order.ETA}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Creación</label>
                        <p className="text-sm text-slate-900">{typeof order.Create_at === 'string' ? order.Create_at : order.Create_at.toISOString().split('T')[0]}</p>
                    </div>
                    {order.Notes && (
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                            <p className="text-sm text-slate-900">{order.Notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Packages Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Paquetes</h3>

                <Table
                    columns={packageColumns}
                    data={packageRows}
                    getRowKey={(row) => row.id}
                    emptyState="No hay paquetes asociados a esta orden"
                />
            </div>
        </div>
    );
}
