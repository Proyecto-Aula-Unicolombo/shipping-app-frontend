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
import { usePagination } from "@/modules/shared/hooks/usePagination";
import { getVisibleUsers, getVisibleUsersCount, type UserRole, type PublicUserRole } from "@/mocks/users";
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
    remitente: "bg-orange-50 text-orange-700",
};

const ROLE_LABELS: Record<PublicUserRole, string> = {
    coordinador: "Coordinador",
    conductor: "Conductor",
    remitente: "Remitente",
};

export default function UsersPage() {
    const router = useRouter();

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
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];
    const [searchValue, setSearchValue] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | PublicUserRole>("all");
    const debouncedSearchTerm = useDebounce(searchValue, 300);

    // Simulate current user role (in real app, this would come from auth context)
    // For demo purposes, we'll use "coordinador" to show the non-admin view
    // Change to "admin" to see all users including other admins
    const currentUserRole: UserRole = "coordinador";

    const visibleUsers = getVisibleUsers(currentUserRole);
    const stats = getVisibleUsersCount(currentUserRole);

    // Filter users based on search query, role, and status
    const filteredUsers = useMemo(() => {
        const term = debouncedSearchTerm.trim().toLowerCase();

        return visibleUsers.filter(user => {
            const matchesSearch = !term ||
                user.Name.toLowerCase().includes(term) ||
                user.LastName.toLowerCase().includes(term) ||
                user.Email.toLowerCase().includes(term);

            const matchesRole = roleFilter === "all" || user.Role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [debouncedSearchTerm, roleFilter, visibleUsers]);

    const {
        page,
        pageSize,
        offset,
        setPage,
        setPageSize,
        totalItems,
        resetPage,
    } = usePagination<5 | 10 | 15>({ totalItems: filteredUsers.length, initialPageSize: 10 });

    const paginatedUsers = filteredUsers.slice(offset, offset + pageSize);
    const tableRows = paginatedUsers.map<UserRow>((user) => ({
        id: user.id,
        name: `${user.Name} ${user.LastName}`,
        email: user.Email,
        role: user.Role as PublicUserRole,
        createdAt: new Date(user.createdAt).toLocaleDateString('es-ES'),
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca',
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
                            <p className="text-sm font-medium text-slate-600">Remitentes</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.byRole.remitente}</p>
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
                    onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">Todos los roles</option>
                    <option value="coordinador">Coordinador</option>
                    <option value="conductor">Conductor</option>
                    <option value="remitente">Remitente</option>
                </select>
            </div>

            <div className="space-y-4">
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