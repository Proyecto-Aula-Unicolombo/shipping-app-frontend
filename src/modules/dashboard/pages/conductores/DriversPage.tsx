"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { ROUTES } from "@/modules/shared/constants/routes";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { useDriverQueryStore } from "../../drivers/hooks/useDriverQueryStore";

type DriverStatus = "Activo" | "Inactivo";
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
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [pageSize, setPageSize] = useState<5 | 10 | 15>(5);
    const [page, setPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchValue, 300);


    const {
        drivers,
        totalItems,
        totalPages,
        isLoading,
        isError,
        error,
    } = useDriverQueryStore({
        listParams: {
            limit: pageSize,
            page: page,
            name_or_lastname: debouncedSearchTerm,
        }
    });


    function getDriverStatus(isActive: boolean): DriverStatus {
        return isActive ? "Activo" : "Inactivo";
    }

    const tableRows: DriverRow[] = drivers.map((driver) => ({
        id: driver.ID,
        name: driver.Name,
        lastName: driver.LastName,
        lastOrderNumber: "#" + (driver.NumOrder ? driver.NumOrder.toString() : "N/A"),
        status: getDriverStatus(driver.IsActive),
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
        const validPage = Math.min(Math.max(1, newPage), totalPages);
        setPage(validPage);
    };

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Conductores" title="Conductores" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500">Cargando conductores...</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Conductores" title="Conductores" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-red-500">
                        Error al cargar conductores: {error?.message || "Error desconocido"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <PageHeader eyebrow="Conductores" title="Conductores" />
                <Button
                    className=""
                    variant="secondary"
                    onClick={() => router.push(`${ROUTES.dashboard.drivers}/crear`)}
                >
                    Crear Conductor
                </Button>
            </div>

            <div className="space-y-4">
                <SearchInput
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre o apellido"
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
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}