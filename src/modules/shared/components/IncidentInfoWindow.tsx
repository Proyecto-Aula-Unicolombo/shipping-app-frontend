import React from 'react';
import type { Incident } from '@/modules/dashboard/incidents/repository/incidentsRepository';

interface IncidentInfoWindowProps {
    incident: Incident;
}

export function IncidentInfoWindow({ incident }: IncidentInfoWindowProps) {
    const driverName = incident.driver_name && incident.driver_lastname
        ? `${incident.driver_name} ${incident.driver_lastname}`
        : 'Sin asignar';

    return (
        <div className="space-y-2 min-w-[250px]">
            <div className="font-semibold text-slate-900">
                INC-{incident.id.toString().padStart(3, '0')}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Estado:</strong> <span className={`font-semibold ${incident.status === 'Abierto' ? 'text-red-600' :
                        incident.status === 'En Progreso' ? 'text-yellow-600' :
                            'text-green-600'
                    }`}>{incident.status}</span>
            </div>
            <div className="text-sm text-slate-600">
                <strong>Ubicación:</strong> {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Conductor:</strong> {driverName}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Descripción:</strong> {incident.description || 'Sin descripción'}
            </div>
            <div className="text-xs text-slate-500">
                {new Date(incident.timestamp).toLocaleString('es-ES')}
            </div>
        </div>
    );
}
