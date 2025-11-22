"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/modules/shared/constants/routes";
import { PageHeader } from "../../components/PageHeader";
import { BackButton } from "../../components/BackButton";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { useOrderQueryStore } from "../../orders/hooks/useOrderQueryStore";
import { PackageItem } from "@/types/ordersWithPackage";
import { Button } from "@/modules/shared/ui/Button";

type PackageStatus = "entregado" | "en camino" | "pendiente" | "asignado";

const PACKAGE_STATUS_STYLES: Record<string, string> = {
    "entregado": "bg-emerald-50 text-emerald-700",
    "en camino": "bg-blue-50 text-blue-700",
    "pendiente": "bg-amber-50 text-amber-600",
    "asignado": "bg-indigo-50 text-indigo-700",
    "cancelado": "bg-red-50 text-red-700",
};

const packageColumns: TableColumn<PackageItem>[] = [
    {
        key: "NumPackage",
        label: "Num. Paquete",
        render: (value: unknown, row: PackageItem) => (
            <div className="flex flex-col">
                <span className="font-medium text-slate-900">{row.NumPackage}</span>
                <span className="text-xs text-slate-500">{row.DescriptionContent}</span>
            </div>
        )
    },
    {
        key: "Status",
        label: "Estado",
        render: (value: unknown) => (
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${PACKAGE_STATUS_STYLES[String(value).toLowerCase()] || "bg-gray-50 text-gray-600"}`}>
                {String(value)}
            </span>
        ),
    },
    {
        key: "Weight",
        label: "Peso / Dim",
        render: (value: unknown, row: PackageItem) => (
            <div className="text-sm text-slate-600">
                <p>{row.Weight} kg</p>
                <p className="text-xs text-slate-400">{row.Dimension}</p>
            </div>
        )
    },
    {
        key: "Receiver",
        label: "Destinatario",
        render: (value: unknown, row: PackageItem) => (
            <div className="text-sm">
                <p className="font-medium text-slate-900">{row.Receiver.name} {row.Receiver.last_name}</p>
                <p className="text-xs text-slate-500">{row.AddressPackage.destination}</p>
            </div>
        )
    },
    {
        key: "actions",
        label: "Acciones",
        render: (value: unknown, row: PackageItem) => (
            <Link href={`/ordenes/paquete/${row.ID}`} className="text-sm font-semibold text-blue-600 hover:underline">
                Ver Detalles
            </Link>
        ),
    },
];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = parseInt(params.id as string);

    const { orderDetail: order, isLoadingOrderDetail } = useOrderQueryStore({
        orderrId: orderId
    });

    const handleReassign = () => {
        router.push(ROUTES.dashboard.assignDriver(orderId));
    };

    if (isLoadingOrderDetail) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <PageHeader eyebrow="Ordenes" title={`Orden #${order.ID}`} />
                        <p className="text-sm text-slate-600 mt-1">
                            Creada el {new Date(order.CreateAt).toLocaleDateString()} • {order.TypeService}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 ">
                    <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${order.Status === "en camino" ? "bg-blue-50 text-blue-700" :
                        order.Status === "entregado" ? "bg-emerald-50 text-emerald-700" :
                            order.Status === "asignada" ? "bg-purple-50 text-purple-700" :
                                order.Status === "incidente" ? "bg-red-50 text-red-700" :
                                    "bg-amber-50 text-amber-600"
                        }`}>
                        {order.Status}
                    </span>
                    <Button variant="primary" onClick={handleReassign}>
                        Reasignar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Information */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Conductor Asignado
                    </h3>
                    {order.Driver ? (
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">Nombre</span>
                                <span className="font-medium text-slate-900">{order.Driver.Name} {order.Driver.LastName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="text-slate-500 text-sm">Email</span>
                                <span className="font-medium text-slate-900">{order.Driver.Email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">ID Conductor</span>
                                <span className="font-medium text-slate-900">#{order.Driver.ID}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">Sin conductor asignado</p>
                    )}
                </div>

                {/* Vehicle Information */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        Vehículo
                    </h3>
                    {order.Vehicle ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Placa</p>
                                <p className="text-lg font-bold text-slate-900">{order.Vehicle.Plate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Tipo</p>
                                <p className="font-medium text-slate-900">{order.Vehicle.VehicleType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Marca/Modelo</p>
                                <p className="font-medium text-slate-900">{order.Vehicle.Brand} {order.Vehicle.Model}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Color</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: order.Vehicle.Color.toLowerCase() }}></span>
                                    <span className="font-medium text-slate-900">{order.Vehicle.Color}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">Sin vehículo asignado</p>
                    )}
                </div>
            </div>

            {/* Additional Info */}
            {order.Observation && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Observaciones</h4>
                    <p className="text-sm text-amber-700">{order.Observation}</p>
                </div>
            )}

            {/* Packages Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Paquetes ({order.Packages?.length || 0})</h3>
                </div>

                <Table<PackageItem>
                    columns={packageColumns}
                    data={order.Packages || []}
                    getRowKey={(row) => row.ID}
                    emptyState="No hay paquetes asociados a esta orden"
                />
            </div>
        </div>
    );
}
