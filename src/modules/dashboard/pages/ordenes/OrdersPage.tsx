"use client";

import { useState } from "react"
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { ROUTES } from "@/modules/shared/constants/routes";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { useOrderQueryStore } from "../../orders/hooks/useOrderQueryStore";
import type { Status, ServiceType } from "@/types/ordersWithPackage";



type OrderRow = Record<string, unknown> & {
    id: number;
    orderNumber: string;
    status: Status;
    serviceType: ServiceType;
    notes?: string;
    actions?: null;
};

const formatStatus = (status: Status): string => {
    const statusMap: Record<Status, string> = {
        "pendiente": "Pendiente",
        "en camino": "En camino",
        "entregado": "Entregado",
        "asignada": "Asignada",
        "incidente": "Incidente",
        "cancelada": "Cancelada",
        "parcialmente_completada": "Parcialmente Completada",
        "finalizada": "Finalizada",
        "completada": "Completada"
    };
    return statusMap[status] || status;
};

export const formatServiceType = (serviceType: ServiceType): string => {
    const serviceMap: Record<ServiceType, string> = {
        "standard delivery": "Standard Delivery",
        "express delivery": "Express Delivery",
    };
    return serviceMap[serviceType] || serviceType;
};


const STATUS_STYLES: Record<Status, string> = {
    "en camino": "bg-blue-50 text-blue-700",
    "entregado": "bg-emerald-50 text-emerald-700",
    "pendiente": "bg-amber-50 text-amber-600",
    "asignada": "bg-purple-50 text-purple-700",
    "incidente": "bg-red-50 text-red-700",
    "cancelada": "bg-red-50 text-red-700",
    "parcialmente_completada": "bg-purple-50 text-purple-700",
    "finalizada": "bg-emerald-50 text-emerald-700",
    "completada": "bg-emerald-50 text-emerald-700"
};

export const SERVICE_TYPE_STYLES: Record<ServiceType, string> = {
    "standard delivery": "bg-gray-100 text-gray-700",
    "express delivery": "bg-purple-50 text-purple-700",
};


export default function OrdersPage() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<5 | 10 | 15>(5);

    const debouncedSearchTerm = useDebounce(searchValue, 300);

    const {
        orders,
        totalItems,
        totalPages,
        isLoadingOrders,
        isErrorOrders,
    } = useOrderQueryStore({
        listParams: {
            limit: pageSize,
            page: page,
            order_id: debouncedSearchTerm,
            type_service: serviceTypeFilter !== "all" ? serviceTypeFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        }
    });

    const tableRows = orders.map<OrderRow>((order) => ({
        id: order.ID,
        orderNumber: order.ID.toString(),
        status: order.Status,
        serviceType: order.TypeService.toLowerCase().trim() as ServiceType,
        notes: order.Observation,
        actions: null,
    }));

    const columns: TableColumn<OrderRow>[] = [
        {
            key: "orderNumber",
            label: "Orden ID",
            render: (value: unknown, row: OrderRow) => (
                <Link href={`${ROUTES.dashboard.orders}/${row.id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                    Order #{String(value)}
                </Link>
            )
        },
        {
            key: "status",
            label: "Estado",
            render: (value) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[value as Status]}`}>
                    {formatStatus(value as Status)}
                </span>
            ),
        },

        {
            key: "serviceType",
            label: "Tipo de servicio",
            render: (value) => {
                const serviceType = value as ServiceType;
                console.log("typeService: " + serviceType)
                return (
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${SERVICE_TYPE_STYLES[serviceType]}`}>
                        {formatServiceType(serviceType)}
                    </span>
                );
            },
        },
        {
            key: "notes",
            label: "Notas",
            className: "max-w-xs truncate text-sm"
        },
    ];
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value as Status | "all");
        setPage(1);
    };

    const handleServiceTypeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setServiceTypeFilter(event.target.value as ServiceType | "all");
        setPage(1);
    };

    const handlePageSizeChange = (newSize: 5 | 10 | 15) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        const validPage = Math.min(Math.max(1, newPage), totalPages);
        setPage(validPage);
    };

    if (isLoadingOrders) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-600">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    if (isErrorOrders) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600">Error al cargar las órdenes</p>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <PageHeader eyebrow="Ordenes" title="Ordenes" />
                    <p className="text-sm text-slate-600 mt-1">Administra tus ordenes</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/ordenes/sin-asignar">
                        <Button variant="ghost">
                            Órdenes sin asignar
                        </Button>
                    </Link>
                    <Link href="/ordenes/crear">
                        <Button
                            variant="secondary"
                        >
                            Crear Orden
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Buscar por ID de orden..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Estado</option>
                            <option value="en camino">En camino</option>
                            <option value="entregado">Entregado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="asignada">Asignada</option>

                        </select>
                        <select
                            value={serviceTypeFilter}
                            onChange={handleServiceTypeFilterChange}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tipo de servicio</option>
                            <option value="standard delivery">Standard Delivery</option>
                            <option value="express delivery">Express Delivery</option>
                        </select>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={tableRows}
                    getRowKey={(row) => row.id}
                    emptyState="No se encontraron ordenes"
                />

                <TablePagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}
