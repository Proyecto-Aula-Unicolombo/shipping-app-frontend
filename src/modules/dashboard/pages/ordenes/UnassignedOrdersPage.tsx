"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";

import { BackButton } from "../../components/BackButton";
import { useOrderQueryStore } from "../../orders/hooks/useOrderQueryStore";
import type { ServiceType } from "@/types/ordersWithPackage";
import { formatServiceType, SERVICE_TYPE_STYLES } from "@/modules/dashboard/pages/ordenes/OrdersPage";

type UnassignedOrderRow = Record<string, unknown> & {
    id: number;
    orderId: string;
    status: string;
    typeService: string;
    actions?: null;
};



const columns: TableColumn<UnassignedOrderRow>[] = [
    {
        key: "orderId",
        label: "Orden ID",
        render: (value: unknown) => (
            <span className="font-medium text-slate-900">{String(value)}</span>
        )
    },
    {
        key: "status",
        label: "Estado",
        render: (value) => (
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600">
                {value as string}
            </span>
        ),
    },
    {
        key: "typeService",
        label: "Tipo de servicio",
        render: (value) => {
            const serviceType = value as ServiceType;

            return (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${SERVICE_TYPE_STYLES[serviceType]}`}>
                    {formatServiceType(serviceType)}
                </span>
            );
        },
    },
    {
        key: "actions",
        label: "Asignar",
        render: (_, row) => (
            <Link href={`/ordenes/asignar/${row.id}`}>
                <Button variant="secondary">
                    Asignar
                </Button>
            </Link>
        ),
    },
];

export default function UnassignedOrdersPage() {
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<5 | 10 | 15>(5);

    const debouncedSearchTerm = useDebounce(searchValue, 300);

    const {
        ordersUnassigned,
        totalItemsUnassigned,
        totalPagesUnassigned,
        isLoadingOrdersUnassigned,
        isErrorOrdersUnassigned,
    } = useOrderQueryStore({
        listParams: {
            limit: pageSize,
            page: page,
            order_id: debouncedSearchTerm,
        }
    });


    const tableRows = ordersUnassigned.map<UnassignedOrderRow>((order) => ({
        id: order.ID,
        orderId: `ORD-#-${order.ID.toString().padStart(3, '0')}`,
        typeService: order.TypeService,
        status: order.Status,
        actions: null,
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };


    const handlePageSizeChange = (newSize: 5 | 10 | 15) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        const validPage = Math.min(Math.max(1, newPage), totalPagesUnassigned);
        setPage(validPage);
    };

    if (isLoadingOrdersUnassigned) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-600">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    if (isErrorOrdersUnassigned) {
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
            <div className="flex items-center gap-4">
                <BackButton />
                <div>
                    <PageHeader eyebrow="Ordenes" title="Ordenes sin asignaciones" />
                    <p className="text-sm text-slate-600 mt-1">Visualiza todas las ordenes que creaste pero no has asignado</p>
                </div>
            </div>


            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Ordenes Disponibles</h3>

                    <div className="space-y-4">
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Buscar por ID de orden"
                        />

                        <Table
                            columns={columns}
                            data={tableRows}
                            getRowKey={(row) => row.id}
                            emptyState="No hay ordenes sin asignar"
                        />

                        <TablePagination
                            page={page}
                            pageSize={pageSize}
                            totalItems={totalItemsUnassigned}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
