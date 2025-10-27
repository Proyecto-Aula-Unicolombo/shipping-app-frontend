import type { DeliveryStop } from "@/types";

export type IncidentListItem = DeliveryStop & {
    status: "Abierto" | "En Progreso" | "Cerrado";
    description: string;
};

export type IncidentDetail = IncidentListItem;

export const incidentsMock: IncidentListItem[] = [
    {
        id: 1,
        StopLocation: {
            lat: 10.3910,
            lng: -75.4794
        },
        TypeStop: "Incidente",
        TimeStamp: "2024-01-15T10:30:00Z",
        Destination: "Centro Histórico, Cartagena",
        DriverID: 1,
        Driver: {
            id: 1,
            PhoneNumber: "+57 300 123 4567",
            License: "LIC-12345",
            UserID: 101,
            User: {
                id: 101,
                Name: "Carlos",
                LastName: "Ramírez",
                Email: "carlos.ramirez@example.com",
                Password: "hashed-password",
                Role: "driver",
            }
        },
        OrderID: 1001,
        status: "Abierto",
        description: "Retraso en la entrega"
    },
    {
        id: 2,
        StopLocation: {
            lat: 10.4010,
            lng: -75.4694
        },
        TypeStop: "Incidente",
        TimeStamp: "2024-01-16T14:15:00Z",
        Destination: "Bocagrande, Cartagena",
        DriverID: 2,
        Driver: {
            id: 2,
            PhoneNumber: "+57 300 765 4321",
            License: "LIC-67890",
            UserID: 102,
            User: {
                id: 102,
                Name: "Sofía",
                LastName: "García",
                Email: "sofia.garcia@example.com",
                Password: "hashed-password",
                Role: "driver",
            }
        },
        OrderID: 1002,
        status: "En Progreso",
        description: "Problema con el vehículo"
    },
    {
        id: 3,
        StopLocation: {
            lat: 10.3810,
            lng: -75.4894
        },
        TypeStop: "Incidente",
        TimeStamp: "2024-01-17T09:45:00Z",
        Destination: "Getsemaní, Cartagena",
        DriverID: 3,
        Driver: {
            id: 3,
            PhoneNumber: "+57 301 234 5678",
            License: "LIC-11223",
            UserID: 103,
            User: {
                id: 103,
                Name: "Diego",
                LastName: "Martínez",
                Email: "diego.martinez@example.com",
                Password: "hashed-password",
                Role: "driver",
            }
        },
        OrderID: 1003,
        status: "Cerrado",
        description: "Entrega exitosa"
    }
];

export function getIncidentById(id: number): IncidentListItem | undefined {
    return incidentsMock.find((incident) => incident.id === id);
}

export function getIncidentsByStatus(status: "Abierto" | "En Progreso" | "Cerrado"): IncidentListItem[] {
    return incidentsMock.filter((incident) => incident.status === status);
}

export function getIncidentsByDriverId(driverId: number): IncidentListItem[] {
    return incidentsMock.filter((incident) => incident.DriverID === driverId);
}
