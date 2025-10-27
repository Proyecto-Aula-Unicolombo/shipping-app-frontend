"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { usePagination } from "@/modules/shared/hooks/usePagination";
import { vehiclesMock } from "@/mocks/vehicles";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiPlus, FiEdit, FiTrash2, FiTruck } from "react-icons/fi";

type VehicleRow = Record<string, unknown> & {
    id: number;
    plate: string;
    brand: string;
    model: string;
    vehicleType: string;
    driverName?: string;
    actions?: null;
};

const VEHICLE_TYPE_STYLES: Record<string, string> = {
    "Furgoneta": "bg-blue-50 text-blue-700",
    "Camión": "bg-green-50 text-green-700",
    "Furgón": "bg-purple-50 text-purple-700",
    "Motocicleta": "bg-yellow-50 text-yellow-700",
    "Bicicleta": "bg-pink-50 text-pink-700",
    "Otro": "bg-gray-50 text-gray-700",
};

export default function VehiclesPage() {
    const router = useRouter();
    
    // Define columns inside component to access router
    const columns: TableColumn<VehicleRow>[] = [
        {
            key: "plate",
            label: "Vehículo",
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <FiTruck className="text-slate-600" size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">{row.plate}</div>
                        <div className="text-xs text-slate-500">{row.brand} {row.model}</div>
                    </div>
                </div>
            ),
        },
        { key: "brand", label: "Marca", className: "text-slate-600" },
        { key: "model", label: "Modelo", className: "text-slate-600" },
        {
            key: "vehicleType",
            label: "Tipo",
            render: (value) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${VEHICLE_TYPE_STYLES[value as string] || VEHICLE_TYPE_STYLES["Otro"]}`}>
                    {value as string}
                </span>
            ),
        },
        {
            key: "driverName",
            label: "Conductor",
            render: (value) => {
                const driverName = value as string;
                return (
                    <span className={driverName ? "text-slate-900" : "text-slate-400"}>
                        {driverName || "Sin asignar"}
                    </span>
                )
            },
        },
        {
            key: "actions",
            label: "Acciones",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Link href={ROUTES.dashboard.editVehicle(row.id)}>
                        <button
                            className="p-1 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                            title="Editar vehículo"
                        >
                            <FiEdit size={16} />
                        </button>
                    </Link>
                    <button
                        className="p-1 cursor-pointer text-slate-400 hover:text-red-600 transition-colors"
                        title="Eliminar vehículo"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const [searchValue, setSearchValue] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | string>("all");
    const debouncedSearchTerm = useDebounce(searchValue, 300);

    const filteredVehicles = useMemo(() => {
        let filtered = vehiclesMock;

        // Filter by search term
        if (debouncedSearchTerm) {
            filtered = filtered.filter(
                (vehicle) =>
                    vehicle.Plate.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    vehicle.Brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    vehicle.Model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                    (vehicle.driverName && vehicle.driverName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            );
        }

        // Filter by type
        if (typeFilter !== "all") {
            filtered = filtered.filter((vehicle) => vehicle.VehicleType === typeFilter);
        }

        return filtered;
    }, [debouncedSearchTerm, typeFilter]);

    const { page, pageSize, offset, limit, goToPage, setPageSize, resetPage } = usePagination({
        totalItems: filteredVehicles.length,
        initialPageSize: 10,
    });

    const paginatedVehicles = useMemo(() => {
        return filteredVehicles.slice(offset, offset + limit);
    }, [filteredVehicles, offset, limit]);

    const vehicleRows: VehicleRow[] = paginatedVehicles.map((vehicle) => ({
        id: vehicle.id,
        plate: vehicle.Plate,
        brand: vehicle.Brand,
        model: vehicle.Model,
        vehicleType: vehicle.VehicleType,
        driverName: vehicle.driverName,
    }));

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        resetPage();
    };

    const handleTypeFilterChange = (type: string) => {
        setTypeFilter(type);
        resetPage();
    };

    // Get unique vehicle types for filter
    const vehicleTypes = Array.from(new Set(vehiclesMock.map(v => v.VehicleType)));

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div className="flex-1">
                    <PageHeader eyebrow="Flota" title="Gestión de Vehículos" />
                </div>
                <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => router.push(ROUTES.dashboard.createVehicle)}
                >
                    <FiPlus size={16} />
                    Nuevo Vehículo
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Vehículos</p>
                            <p className="text-2xl font-bold text-slate-900">{vehiclesMock.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FiTruck className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Asignados</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {vehiclesMock.filter(v => v.driverId).length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <FiTruck className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Disponibles</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {vehiclesMock.filter(v => !v.driverId).length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <FiTruck className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Tipos</p>
                            <p className="text-2xl font-bold text-slate-900">{vehicleTypes.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <FiTruck className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Buscar por placa, marca, modelo o conductor..."
                            value={searchValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeFilterChange(e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">Todos los tipos</option>
                            {vehicleTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200">
                <Table
                    columns={columns}
                    data={vehicleRows}
                    emptyState={
                        <div className="text-center py-12">
                            <FiTruck className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-2 text-sm font-semibold text-slate-900">No hay vehículos</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {searchValue || typeFilter !== "all"
                                    ? "No se encontraron vehículos con los filtros aplicados."
                                    : "Comienza agregando un nuevo vehículo a la flota."}
                            </p>
                        </div>
                    }
                />
                
                <TablePagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={filteredVehicles.length}
                    onPageChange={goToPage}
                    onPageSizeChange={setPageSize}
                    className="border-t border-slate-200"
                />
            </div>
        </div>
    );
}
