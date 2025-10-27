import React from 'react';
import type { IncidentListItem } from '@/mocks/incidents';

interface IncidentInfoWindowProps {
    incident: IncidentListItem;
}

export function IncidentInfoWindow({ incident }: IncidentInfoWindowProps) {
    return (
        <div className="space-y-2">
            <div className="font-semibold text-slate-900">
                INC-{incident.id.toString().padStart(3, '0')}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Estado:</strong> {incident.status}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Ubicación:</strong> {incident.Destination}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Conductor:</strong> {incident.Driver?.User.Name} {incident.Driver?.User.LastName}
            </div>
            <div className="text-sm text-slate-600">
                <strong>Descripción:</strong> {incident.description}
            </div>
            <div className="text-xs text-slate-500">
                {new Date(incident.TimeStamp).toLocaleString('es-ES')}
            </div>
        </div>
    );
}
