"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { usePagination } from "@/modules/shared/hooks/usePagination";
import { getUnassignedOrders } from "@/mocks/orders";
import { BackButton } from "../../components/BackButton";

type UnassignedOrderRow = Record<string, unknown> & {
    id: number;
    orderId: string;
    clientName: string;
    deliveryAddress: string;
    status: string;
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
    { key: "clientName", label: "Nombre de cliente" },
    { 
        key: "deliveryAddress", 
        label: "Dirección de entrega",
        className: "max-w-xs"
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
    const debouncedSearchTerm = useDebounce(searchValue, 300);
    
    const unassignedOrders = getUnassignedOrders();
    
    const filteredOrders = useMemo(() => {
        const term = debouncedSearchTerm.trim().toLowerCase();
        if (!term) {
            return unassignedOrders;
        }

        return unassignedOrders.filter((order) =>
            [
                order.id.toString(),
                order.ClientName,
                order.DeliveryAddress,
            ].some((field) => field.toLowerCase().includes(term))
        );
    }, [debouncedSearchTerm, unassignedOrders]);

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
    const tableRows = paginatedOrders.map<UnassignedOrderRow>((order) => ({
        id: order.id,
        orderId: `ORD-2023-${order.id.toString().padStart(3, '0')}`,
        clientName: order.ClientName,
        deliveryAddress: order.DeliveryAddress,
        status: order.Status,
        actions: null,
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        resetPage();
    };

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
                            placeholder="Buscar por ID de orden, cliente o dirección..."
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
                            totalItems={totalItems}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                resetPage();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
