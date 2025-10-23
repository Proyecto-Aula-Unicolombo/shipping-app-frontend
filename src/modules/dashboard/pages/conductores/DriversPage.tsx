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
import { driversMock, type DriverListItem } from "@/mocks/drivers";

type DriverStatus = DriverListItem["status"];
type DriverRow = Record<string, unknown> & {
    id: number;
    name: string;
    lastName: string;
    lastOrderNumber: string;
    status: DriverStatus;
    actions?: null;
};

const STATUS_STYLES: Record<DriverStatus, string> = {
    Activo: "bg-emerald-50 text-emerald-700",
    Inactivo: "bg-amber-50 text-amber-600",
};

const columns: TableColumn<DriverRow>[] = [
    { key: "name", label: "Nombre" },
    { key: "lastName", label: "Apellido" },
    { key: "lastOrderNumber", label: "Número de orden" },
    {
        key: "status",
        label: "Estado",
        render: (value) => (
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[value as DriverStatus]}`}>
                {value as string}
            </span>
        ),
    },
    {
        key: "actions",
        label: "Acciones",
        render: (_, row) => (
            <Link href={`${ROUTES.dashboard.drivers}/${row.id}`} className="text-sm font-semibold text-[#4D7399] hover:underline">
                Ver detalles
            </Link>
        ),
    },
];

export default function DriversPage() {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchTerm = useDebounce(searchValue, 300);
    const filteredDrivers = useMemo(() => {
        const term = debouncedSearchTerm.trim().toLowerCase();
        if (!term) {
            return driversMock;
        }

        return driversMock.filter((driver) =>
            [driver.User.Name, driver.User.LastName, driver.lastOrderNumber].some((field) =>
                field.toLowerCase().includes(term)
            )
        );
    }, [debouncedSearchTerm]);

    const {
        page,
        pageSize,
        offset,
        setPage,
        setPageSize,
        totalItems,
        resetPage,
    } = usePagination<5 | 10 | 15>({ totalItems: filteredDrivers.length, initialPageSize: 5 });

    const paginatedDrivers = filteredDrivers.slice(offset, offset + pageSize);
    const tableRows = paginatedDrivers.map<DriverRow>((driver) => ({
        id: driver.id,
        name: driver.User.Name,
        lastName: driver.User.LastName,
        lastOrderNumber: driver.lastOrderNumber,
        status: driver.status,
        actions: null,
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        resetPage();
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <PageHeader eyebrow="Conductores" title="Conductores" />
                <Button
                    className=""
                    variant="secondary"
                    onClick={() => console.log("Crear conductor")}
                >
                    Crear Conductor
                </Button>
            </div>

            <div className="space-y-4">
                <SearchInput
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre, apellido o número de orden"
                />

                <Table
                    columns={columns}
                    data={tableRows}
                    getRowKey={(row) => row.id}
                    emptyState="No se encontraron conductores"
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