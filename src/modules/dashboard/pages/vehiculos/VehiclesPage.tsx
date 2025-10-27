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
import { usePagination } from "@/modules/shared/hooks/usePagination";
import { useVehicleQueryStore } from "../../vehicles/hooks/useVehicleQueryStore";

type VehicleRow = Record<string, unknown> & {
    id: number;
    plate: string;
    brand: string;
    model: string;
    vehicleType: string;
    color: string;
    actions?: null;
};

const columns: TableColumn<VehicleRow>[] = [
    { key: "plate", label: "Placa" },
    { key: "brand", label: "Marca" },
    { key: "model", label: "Modelo" },
    { key: "vehicleType", label: "Tipo" },
    { key: "color", label: "Color" },
    {
        key: "actions",
        label: "Acciones",
        render: (_, row) => (
            <Link href={`${ROUTES.dashboard.vehicles}/${row.id}`} className="text-sm font-semibold text-[#4D7399] hover:underline">
                Ver detalles
            </Link>
        ),
    },
];

export default function VehiclesPage() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchTerm = useDebounce(searchValue, 300);
    
    // Use React Query store for vehicles data
    const { vehicles, isLoading, isError, error } = useVehicleQueryStore();
    
    const filteredVehicles = useMemo(() => {
        const term = debouncedSearchTerm.trim().toLowerCase();
        if (!term) {
            return vehicles;
        }

        return vehicles.filter((vehicle) =>
            [vehicle.Plate, vehicle.Brand, vehicle.Model, vehicle.VehicleType, vehicle.Color].some((field) =>
                field.toLowerCase().includes(term)
            )
        );
    }, [debouncedSearchTerm, vehicles]);

    const {
        page,
        pageSize,
        offset,
        setPage,
        setPageSize,
        totalItems,
        resetPage,
    } = usePagination<5 | 10 | 15>({ totalItems: filteredVehicles.length, initialPageSize: 5 });

    const paginatedVehicles = filteredVehicles.slice(offset, offset + pageSize);
    const tableRows = paginatedVehicles.map<VehicleRow>((vehicle) => ({
        id: vehicle.id,
        plate: vehicle.Plate,
        brand: vehicle.Brand,
        model: vehicle.Model,
        vehicleType: vehicle.VehicleType,
        color: vehicle.Color,
        actions: null,
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        resetPage();
    };

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Vehículos" title="Vehículos" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500">Cargando vehículos...</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <PageHeader eyebrow="Vehículos" title="Vehículos" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-red-500">
                        Error al cargar vehículos: {error?.message || "Error desconocido"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <PageHeader eyebrow="Vehículos" title="Vehículos" />
                <Button
                    className=""
                    variant="secondary"
                    onClick={() => router.push(`${ROUTES.dashboard.vehicles}/crear`)}
                >
                    Crear Vehículo
                </Button>
            </div>

            <div className="space-y-4">
                <SearchInput
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Buscar por placa, marca, modelo o tipo"
                />

                <Table
                    columns={columns}
                    data={tableRows}
                    getRowKey={(row) => row.id}
                    emptyState="No se encontraron vehículos"
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
