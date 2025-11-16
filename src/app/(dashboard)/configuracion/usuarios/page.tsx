"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/modules/dashboard/components/BackButton";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { Button } from "@/modules/shared/ui/Button";
import { Table, type TableColumn } from "@/modules/shared/components/table/Table";
import { TablePagination } from "@/modules/shared/components/table/TablePagination";
import { SearchInput } from "@/modules/shared/components/SearchInput";
import { useDebounce } from "@/modules/shared/hooks/useDebounce";
import { useUserQueryStore } from "@/modules/dashboard/users/hooks/useUserQueryStore";
import { PublicUserRole, UserRole } from "@/types/users";
import { ROUTES } from "@/modules/shared/constants/routes";
import { FiPlus, FiEdit, FiTrash2, FiUser } from "react-icons/fi";
import Link from "next/link";

type UserRow = Record<string, unknown> & {
    id: number;
    name: string;
    email: string;
    role: PublicUserRole;
    actions?: null;
};

const ROLE_STYLES: Record<PublicUserRole, string> = {
    coordinador: "bg-blue-50 text-blue-700",
    conductor: "bg-green-50 text-green-700",
    administrador: "bg-orange-50 text-orange-700",
};

const ROLE_LABELS: Record<PublicUserRole, string> = {
    coordinador: "Coordinador",
    conductor: "Conductor",
    administrador: "Administrador",
};

export default function UsersPage() {
    const router = useRouter();

    const [searchValue, setSearchValue] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<5 | 10 | 15>(5);
    const {deleteUserAsync, isDeleting} = useUserQueryStore();

    const debouncedSearchTerm = useDebounce(searchValue, 300);


    const {
        users,
        totalItems,
        totalPages,
        isLoading,
        isError,
    } = useUserQueryStore({
        listParams: {
            limit: pageSize,
            page: page,
            name_or_last_name: debouncedSearchTerm,
            role: roleFilter,
        }
    });

    const stats = {
        total: totalItems,
        byRole: {
            coordinador: users.filter((u) => u.Role === "coord").length,
            conductor: users.filter((u) => u.Role === "driver").length,
            administrador: users.filter((u) => u.Role === "admin").length,
        }
    }

    const onDeleteUser = async (userId: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                await deleteUserAsync(userId);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Define columns inside component to access router
    const columns: TableColumn<UserRow>[] = [
        {
            key: "name",
            label: "Usuario",
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                            {row.name.split(' ')[0]?.charAt(0)}{row.name.split(' ')[1]?.charAt(0) || ''}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">ID: {row.id}</div>
                    </div>
                </div>
            ),
        },
        { key: "email", label: "Email", className: "text-slate-600" },
        {
            key: "role",
            label: "Rol",
            render: (value) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ROLE_STYLES[value as PublicUserRole]}`}>
                    {ROLE_LABELS[value as PublicUserRole]}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Acciones",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Link href={ROUTES.settings.editUser(row.id)}>
                        <button
                            className="p-1 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                            title="Editar usuario"
                        >
                            <FiEdit size={16} />
                        </button>
                    </Link>
                    <button
                        className="p-1 cursor-pointer text-slate-400 hover:text-red-600 transition-colors"
                        title="Eliminar usuario"
                        onClick={() => onDeleteUser(row.id)}
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];


    const tableRows: UserRow[] = users.map((user) => ({
        id: user.ID,
        name: `${user.Name} ${user.LastName}`,
        email: user.Email,
        role: user.Role === "admin" ? "administrador" : user.Role === "coord" ? "coordinador" : "conductor",
    }));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        // resetPage();
        setPage(1);
    };

    const handleRoleChange = (newRole: string) => {
        setRoleFilter(newRole as typeof roleFilter);
        // resetPage();
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


    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <BackButton />
                <div className="flex-1">
                    <PageHeader eyebrow="Configuración" title="Gestión de Usuarios" />
                </div>
                <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => router.push("/configuracion/usuarios/crear")}
                >
                    <FiPlus size={16} />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FiUser className="h-6 w-6 text-slate-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Coordinadores</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.byRole.coordinador}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Conductores</p>
                            <p className="text-2xl font-bold text-green-600">{stats.byRole.conductor}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Administradores</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.byRole.administrador}</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <SearchInput
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre, apellido o email..."
                    className="flex-1"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">Todos los roles</option>
                    <option value="coord">Coordinador</option>
                    <option value="driver">Conductor</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">Cargando usuarios...</div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-600">Error al cargar usuarios</div>
                ) : (
                    <>
                        <Table
                            columns={columns}
                            data={tableRows}
                            getRowKey={(row) => row.id}
                            emptyState="No se encontraron usuarios"
                        />

                        <TablePagination
                            page={page}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}