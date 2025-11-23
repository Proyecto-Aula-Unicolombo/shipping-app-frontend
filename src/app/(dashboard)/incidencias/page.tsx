"use client";

import { useState, useMemo } from "react";
import { useIncidentsQuery } from "@/modules/dashboard/incidents/hooks/useIncidentsQuery";
import { Button } from "@/modules/shared/ui/Button";
import { FiPlus, FiSearch, FiMapPin, FiClock, FiUser, FiRefreshCw } from "react-icons/fi";

export default function IncidentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "Abierto" | "En Progreso" | "Cerrado">("all");

    // Fetch incidents from API using React Query
    const { incidents, isLoading, error, refetch } = useIncidentsQuery({
        listParams: {
            status: statusFilter === "all" ? undefined : statusFilter,
        },
    });

    // Filter incidents based on search query (client-side filtering)
    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            const matchesSearch = incident.id.toString().includes(searchQuery.toLowerCase()) ||
                incident.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                incident.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                incident.driver_lastname?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
    }, [incidents, searchQuery]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Abierto":
                return "bg-red-100 text-red-700";
            case "En Progreso":
                return "bg-yellow-100 text-yellow-700";
            case "Cerrado":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusCount = (status: "Abierto" | "En Progreso" | "Cerrado") => {
        return incidents.filter(incident => incident.status === status).length;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Incidentes</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Administra y monitorea incidentes de entrega en tiempo real
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => refetch()}
                        variant="ghost"
                        className="flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <FiRefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Actualizar
                    </Button>
                    <Button className="flex items-center gap-2">
                        <FiPlus size={16} />
                        Reportar Incidente
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Incidentes Abiertos</p>
                            <p className="text-2xl font-bold text-red-600">{getStatusCount("Abierto")}</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">En Progreso</p>
                            <p className="text-2xl font-bold text-yellow-600">{getStatusCount("En Progreso")}</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Resueltos</p>
                            <p className="text-2xl font-bold text-green-600">{getStatusCount("Cerrado")}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por ID, ubicación, descripción o conductor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">Todos los estados</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Cerrado">Cerrado</option>
                </select>
            </div>

            {/* Incidents Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                    <div className="grid grid-cols-6 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <div>ID</div>
                        <div>Estado</div>
                        <div>Conductor</div>
                        <div>Ubicación</div>
                        <div>Fecha</div>
                        <div>Descripción</div>
                    </div>
                </div>
                <div className="divide-y divide-slate-200">
                    {isLoading ? (
                        <div className="px-6 py-12 text-center">
                            <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-slate-400 mb-3" />
                            <p className="text-slate-500">Cargando incidentes...</p>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-red-500 mb-2">Error: {error?.message || 'Error al cargar incidentes'}</p>
                            <Button onClick={() => refetch()} variant="secondary">
                                Reintentar
                            </Button>
                        </div>
                    ) : filteredIncidents.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-500">No se encontraron incidentes</p>
                        </div>
                    ) : (
                        filteredIncidents.map((incident) => {
                            const driverFullName = incident.driver_name && incident.driver_lastname
                                ? `${incident.driver_name} ${incident.driver_lastname}`
                                : 'Sin asignar';

                            return (
                                <div key={incident.id} className="px-6 py-4 hover:bg-slate-50">
                                    <div className="grid grid-cols-6 gap-4 items-center">
                                        <div className="text-sm font-medium text-slate-900">
                                            INC-{incident.id.toString().padStart(3, '0')}
                                        </div>
                                        <div>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(incident.status)}`}>
                                                {incident.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiUser size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">
                                                {driverFullName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-600 truncate">
                                                {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiClock size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">
                                                {new Date(incident.timestamp).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600 truncate">
                                            {incident.description || 'Sin descripción'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
