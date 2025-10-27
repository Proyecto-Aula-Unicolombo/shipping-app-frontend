"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { ROUTES } from "@/modules/shared/constants/routes";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { usePagination } from "@/modules/shared/hooks/usePagination";
import { ordersMock } from "@/mocks/orders";

type OrderStatus = "En camino" | "Entregado" | "Pendiente";
type ServiceType = "Standard Delivery" | "Express Delivery";

type OrderRow = Record<string, unknown> & {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    sla: string;
    eta: string;
    serviceType: ServiceType;
    deliveryAddress: string;
    clientName: string;
    contactPhone: string;
    notes?: string;
    actions?: null;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
    "En camino": "bg-blue-50 text-blue-700",
    "Entregado": "bg-emerald-50 text-emerald-700",
    "Pendiente": "bg-amber-50 text-amber-600",
};

const SERVICE_TYPE_STYLES: Record<ServiceType, string> = {
    "Standard Delivery": "bg-gray-50 text-gray-700",
    "Express Delivery": "bg-purple-50 text-purple-700",
};

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
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[value as OrderStatus]}`}>
                {value as string}
            </span>
        ),
    },
    { key: "sla", label: "SLA", className: "text-sm" },
    { key: "eta", label: "ETA", className: "text-sm" },
    {
        key: "serviceType",
        label: "Tipo de servicio",
        render: (value) => (
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${SERVICE_TYPE_STYLES[value as ServiceType]}`}>
                {(value as string).replace(' Delivery', '')}
            </span>
        ),
    },
    {
        key: "deliveryAddress",
        label: "Dirección de entrega",
        className: "max-w-xs truncate text-sm"
    },
    { key: "clientName", label: "Cliente", className: "text-sm" },
    { key: "contactPhone", label: "Contacto", className: "text-sm" },
    {
        key: "notes",
        label: "Notas",
        className: "max-w-xs truncate text-sm"
    },
];

export default function OrdersPage() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "all">("all");

    const debouncedSearchTerm = useDebounce(searchValue, 300);

    const filteredOrders = useMemo(() => {
        let filtered = ordersMock;

        // Filter by search term
        const term = debouncedSearchTerm.trim().toLowerCase();
        if (term) {
            filtered = filtered.filter((order) =>
                [
                    order.id.toString(),
                    order.ClientName,
                    order.DeliveryAddress,
                    order.ContactPhone,
                    order.Notes || ""
                ].some((field) => field.toLowerCase().includes(term))
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.Status === statusFilter);
        }

        // Filter by service type
        if (serviceTypeFilter !== "all") {
            filtered = filtered.filter((order) => order.ServiceType === serviceTypeFilter);
        }

        return filtered;
    }, [debouncedSearchTerm, statusFilter, serviceTypeFilter]);

    const {
        page,
        pageSize,
        offset,
        setPage,
        setPageSize,
        totalItems,
        resetPage,
    } = usePagination<5 | 10 | 15>({ totalItems: filteredOrders.length, initialPageSize: 5 });

    const paginatedOrders = filteredOrders.slice(offset, offset + pageSize);
    const tableRows = paginatedOrders.map<OrderRow>((order) => ({
        id: order.id,
        orderNumber: order.id.toString(),
        status: order.Status as OrderStatus,
        sla: order.SLA,
        eta: order.ETA,
        serviceType: order.ServiceType,
        deliveryAddress: order.DeliveryAddress,
        clientName: order.ClientName,
        contactPhone: order.ContactPhone,
        notes: order.Notes,
        actions: null,
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        resetPage();
    };

    const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value as OrderStatus | "all");
        resetPage();
    };

    const handleServiceTypeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setServiceTypeFilter(event.target.value as ServiceType | "all");
        resetPage();
    };

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
                            <option value="En camino">En camino</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                        <select
                            value={serviceTypeFilter}
                            onChange={handleServiceTypeFilterChange}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tipo de servicio</option>
                            <option value="Standard Delivery">Standard Delivery</option>
                            <option value="Express Delivery">Express Delivery</option>
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
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        resetPage();
                    }}
                />
            </div>
        </div>
    );
}
