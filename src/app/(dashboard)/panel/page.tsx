"use client";

import { useState } from "react";
import { AdvancedGoogleMap } from "@/modules/shared/components/AdvancedGoogleMap";
import { incidentsMock, type IncidentListItem } from "@/mocks/incidents";
import { incidentsToMarkers, getMapBounds } from "@/modules/shared/utils/mapHelpers";
import { IncidentInfoWindow } from "@/modules/shared/components/IncidentInfoWindow";
import { FiSearch } from "react-icons/fi";

export default function DashboardPanelPage() {
    const [searchQuery, setSearchQuery] = useState("");
    
    // Filter incidents based on search query
    const filteredIncidents = incidentsMock.filter(incident =>
        incident.id.toString().includes(searchQuery.toLowerCase()) ||
        incident.Destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create markers for the map from incidents using helper function
    const mapMarkers = incidentsToMarkers(incidentsMock).map(marker => ({
        ...marker,
        infoContent: marker.data ? <IncidentInfoWindow incident={marker.data as IncidentListItem} /> : undefined
    }));
    const mapBounds = getMapBounds(mapMarkers);

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
                
                {/* Search Bar */}
                <div className="relative w-96">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar órdenes, vehículos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Real-time Map Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Mapa en Tiempo Real</h2>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <AdvancedGoogleMap
                        center={mapBounds.center}
                        zoom={mapBounds.zoom}
                        className="w-full h-96"
                        markers={mapMarkers}
                        enableClustering={true}
                    />
                </div>
            </div>

            {/* Incidents Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Incidentes</h2>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                        <div className="grid grid-cols-5 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>ID</div>
                            <div>Estado</div>
                            <div>Ubicación</div>
                            <div>Fecha</div>
                            <div>Descripción</div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {filteredIncidents.map((incident) => (
                            <div key={incident.id} className="px-6 py-4 hover:bg-slate-50">
                                <div className="grid grid-cols-5 gap-4 items-center">
                                    <div className="text-sm font-medium text-slate-900">
                                        INC-{incident.id.toString().padStart(3, '0')}
                                    </div>
                                    <div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(incident.status)}`}>
                                            {incident.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {incident.Destination}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {new Date(incident.TimeStamp).toLocaleDateString('es-ES')}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {incident.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
